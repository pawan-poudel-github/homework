import RoomPosts from "@/components/client/RoomPosts";
import Announce from "@/components/server/Announce";
import RoomSettings from "@/components/server/RoomSettings";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

import BackButton from "@/components/client/BackButton";
import { LogIn, Radio } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Assignments",
  description: "View new assignments.",
};
const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const joinedRoom = await db.roomEnrolled.findFirst({
    where: {
      roomId: id,
      userId: session?.user.id,
    },
    include: {
      room: true,
    },
  });

  if (!joinedRoom) {
    return notFound();
  }
  const userAllowedToPost =
    joinedRoom.room.canStudentPost ||
    joinedRoom.room.adminId == session?.user.id;
  return (
    <section className="container relative mt-24 pb-3 md:px-28">
      <BackButton />
      <div
        className="flex justify-between px-4 py-1 h-40 items-end bg-cover bg-no-repeat rounded-lg bg-right bg-[--theme-color] relative"
        style={{
          backgroundImage: "url('/homeworkBg.png')",
        }}
      >
        <div className="absolute top-2 left-3 py-1 px-3 rounded-full bg-[--theme-color] text-white text-xs flex items-center gap-x-2">
          <Radio width={14} />
          Live Updates
        </div>
        <div className="absolute top-2 right-3 py-1 px-3 rounded-full bg-[--theme-color] text-white text-xs flex items-center gap-x-2">
          <LogIn width={14} />
          {joinedRoom.room.code}
        </div>
        <div className="absolute right-3 bottom-2 bg-white rounded-full">
          <RoomSettings roomId={id} />
        </div>
        <h2 className="text-lg sm:text-2xl font-semibold text-white capitalize">
          {joinedRoom.room.name}
        </h2>
      </div>
      {userAllowedToPost && <Announce roomId={id} />}

      <main className="mt-6">
        <RoomPosts roomId={id} />
      </main>
    </section>
  );
};

export default page;
