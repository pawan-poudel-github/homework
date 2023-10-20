import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { BadgeInfo, ChevronsDownUp, Settings } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import RoomAdmin from "../client/RoomAdmin";
import RoomJoinOptions from "../client/InviteUsers";
import LeaveRoom from "../client/LeaveRoom";

const RoomSettings = async ({ roomId }: { roomId: string }) => {
  const session = await getServerSession(authOptions);

  const room = await db.room.findFirst({
    where: {
      id: roomId,
    },
  });
  const users = await db.roomEnrolled.findMany({
    where: {
      roomId: roomId,
    },
    include: {
      user: true,
    },
  });

  const joinedUsers = users.filter((item) => item.userId !== session?.user.id);

  const approvedJoinedUsers = joinedUsers.filter((user) => {
    return user.approved;
  });
  const pendingJoinedUsers = joinedUsers.filter((user) => {
    return !user.approved;
  });

  const usersElement = approvedJoinedUsers.map((item, index) => {
    return (
      <li key={index} className="flex items-center gap-x-2 p-2">
        <Image
          src={item.user.image!}
          alt={"user"}
          height={30}
          width={30}
          className="rounded-full"
        />
        <p>{item.user.name}</p>
      </li>
    );
  });
  const isAdmin = session?.user.id === room?.adminId;
  return (
    <Sheet>
      <SheetTrigger className="p-2 rounded-full">
        <BadgeInfo width={20} height={20} />
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader className="mt-5">
          <SheetTitle className="text-left flex justify-between item-center">
            {room?.name}
            <RoomJoinOptions code={room?.code!} />
          </SheetTitle>
        </SheetHeader>
        <p className="text-base -mt-1 pb-1">{room?.section}</p>
        <hr />
        <div className="mt-3">
          <Collapsible>
            <CollapsibleTrigger>
              <h2 className="font-medium flex items-center gap-x-3">
                Users Enrolled
                <span className="block p-2 bg-gray-50 rounded-md">
                  <ChevronsDownUp size={14} />
                </span>
              </h2>
            </CollapsibleTrigger>
            <div className="flex items-center gap-x-2 p-2 mt-2">
              <Image
                src={session?.user.image!}
                alt={"user"}
                height={30}
                width={30}
                className="rounded-md"
              />
              <p>
                {session?.user.name} (<i className="text-xs">you</i>)
              </p>
            </div>
            <hr />
            <CollapsibleContent>
              <ul>{usersElement}</ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
        {isAdmin && (
          <RoomAdmin room={room!} pendingJoinedUsers={pendingJoinedUsers} />
        )}
        {!isAdmin && <LeaveRoom roomId={room?.id!} />}
      </SheetContent>
    </Sheet>
  );
};

export default RoomSettings;
