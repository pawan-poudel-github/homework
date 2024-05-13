"use client";
import { AssignmentPost, AssignmentWithUser } from "@/types/Room";
import Toast from "awesome-toast-component";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PostSkeleon from "../server/PostSkeleon";
import { pusherClient } from "@/lib/pusher";

const RoomPosts = ({ roomId }: { roomId: string }) => {
  const [posts, setPosts] = useState<AssignmentWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  useEffect(() => {
    const fetchPost = async () => {
     
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

          //to prevent from duplicate posts-if any
          const uniquePosts = new Set([...posts, ...(data.posts || [])]);

          setPosts(Array.from(uniquePosts));
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
    if(!loading){
       fetchPost();
    }
   

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roomId]);

  useEffect(() => {
    const handleScroll = () => {
      const {scrollTop,clientHeight,scrollHeight} = document.documentElement;
    
    
      if (scrollTop+clientHeight >= scrollHeight-100 && !loading) {
        if (page <= totalPage) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalPage, page]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let postsElement = posts.map((post, index) => {
    return (
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
              {new Date(post.created_at.toLocaleString()).toDateString()}
            </i>
          </div>
        </div>
        <div className="mt-2 ml-12">
          <p className="font-medium">{post.title}</p>
        </div>
      </Link>
    );
  });


  return (
    <>
      {posts.length > 0 && <>{postsElement}</>}
      {loading && <PostSkeleon />}
      {!loading && (
        <p className="text-sm text-center italic my-2">No more posts.</p>
      )}
    </>
  );
};

export default RoomPosts;