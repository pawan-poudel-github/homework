import InvitationJoin from "@/components/client/InvitationJoin";
import { db } from "@/lib/db";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join new Room - Homework",
  description: "You are invited to join new room.",
};
const page = async ({ params }: { params: { code: string } }) => {
  const { code } = params;

  const room = await db.room.findFirst({
    where: {
      code,
    },
    include: {
      admin: true,
    },
  });
  if (!room) {
    return notFound();
  }
  return (
    <section className="h-screen grid place-items-center bg-[#007991]">
      <div className="bg-white shadow-sm p-5 px-8 rounded-xl text-center grid justify-items-center border border-gray-50 shadow-gray-50 w-full max-w-md relative">
        <div className="absolute w-10 h-10 top-2 -right-1">
          <Link href={"/"}>
            <X size={20} />
          </Link>
        </div>
        <Image
          width={55}
          height={55}
          src={room.admin.image!}
          alt="Admin Image"
          className="rounded-lg mt-4"
        />
        <p className="text-sm mt-1">You&apos;ve been Invited to join</p>
        <h2 className="text-2xl capitalize font-semibold leading-6 mt-1">
          {room.name}
        </h2>
        <div className="mt-5 w-full">
          <InvitationJoin roomCode={code} />
        </div>
        <p className="text-sm mt-1">By: {room.admin.name}</p>
      </div>
    </section>
  );
};

export default page;

