import Room from "@/components/server/Room";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms - Homework",
  description: "Create, join or manage a room.",
};
const page = async () => {
  const session = await getServerSession(authOptions);

  const JoinedRooms = await db.roomEnrolled.findMany({
    where: {
      userId: session?.user.id,
      approved: true,
    },
    include: {
      user: true,
      room: {
        include: {
          admin: true,
        },
      },
    },
  });

  let rooms = JoinedRooms.map((room, index) => {
    return <Room key={index} joinedRoom={room} />;
  });
  return (
    <section className="container mt-24">
      {JoinedRooms.length > 0 ? (
        <div className="flex gap-3 gap-x-6 flex-wrap">{rooms}</div>
      ) : (
        <div className="flex items-center justify-center flex-col">
          <Image
            src="/no-room.svg"
            height={300}
            width={300}
            alt="No room Image"
            priority
          />
          <p className="text-sm mt-4">You are not in any room yet.</p>
          <h2 className="flex items-center mt-1 font-medium text-lg">
            Click on <Plus size={19} className="mx-1" strokeWidth={2.5} /> icon
            to join or create room.
          </h2>
        </div>
      )}
    </section>
  );
};

export default page;
