"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Toast from "awesome-toast-component";
import PostSkeleon from "../server/PostSkeleon";
import { pusherClient } from "@/lib/pusher";
import { AssignmentPost, AssignmentWithUser } from "@/types/Room";

const RoomPosts = ({ roomId }: { roomId: string }) => {
  const [posts, setPosts] = useState<AssignmentWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchPost = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const { data }: { data: AssignmentPost } = await axios.post(
          "/api/room/posts",
          {
            page,
            roomId,
          }
        );
        if (data.success) {
          setTotalPage(data.totalPages as number);
          setPosts((prevPosts) => [...prevPosts, ...(data.posts || [])]);
        } else {
          new Toast(data.message, {
            style: {
              container: [["background-color", "#d0052a"]],
              message: [["color", "#fff"]],
              bold: [["font-weight", "bold"]],
            },
          });
        }
      } catch (error) {
        new Toast("Can't fetch post, reload your browser.", {
          style: {
            container: [["background-color", "#d0052a"]],
            message: [["color", "#fff"]],
            bold: [["font-weight", "bold"]],
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [page, roomId, loading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (!loading && scrollPosition + windowHeight >= documentHeight - 100 && page < totalPage) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, totalPage, page]);

  useEffect(() => {
    const handleNewPost = (data: AssignmentWithUser) => {
      setPosts((prev) => [data, ...prev]);
      new Toast(`${data.user.name} announced a post.`);
    };

    pusherClient.subscribe(roomId);
    pusherClient.bind("newpost", handleNewPost);
    return () => {
      pusherClient.unsubscribe(roomId);
      pusherClient.unbind("newpost", handleNewPost);
    };
  }, [roomId]);

  return (
    <div>
      {posts.length > 0 && posts.map((post, index) => (
        <Link
          key={index}
          passHref
          href={"assignment/" + post.id + "?roomid=" + roomId}
          className="block mt-6 py-4 px-3 shadow-sm rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-x-4">
            <Image
              className="rounded-full block"
              width={35}
              height={35}
              src={post.user.image!}
              alt={post.user.name}
            />
            <div>
              <p className="text-sm">{post.user.name}</p>
              <i className="text-xs block">
                {new Date(post.created_at).toDateString()}
              </i>
            </div>
          </div>
          <div className="mt-2 ml-12">
            <p className="font-medium">{post.title}</p>
          </div>
        </Link>
      ))}
      {loading && <PostSkeleon />}
      {!loading && (
        <p className="text-sm text-center italic my-2">No more posts.</p>
      )}
    </div>
  );
};

export default RoomPosts;
