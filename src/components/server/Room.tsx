import Image from "next/image";
import Link from "next/link";
import RoomJoinOptions from "../client/InviteUsers";

interface joinedRoom {
  id: string;
  userId: string;
  roomId: string;
  created_at: Date;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
  room: {
    id: string;
    name: string;
    section: string;
    code: string;
    adminId: string;
    created_at: Date;
    admin: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date | null;
      image: string | null;
    };
  };
}

const Room = ({ joinedRoom }: { joinedRoom: joinedRoom }) => {
  return (
    <div className="w-full shadow-sm max-w-xs rounded-md hover:shadow-md mx-auto sm:mx-0">
      <Link
        href={`/room/${joinedRoom.roomId}`}
        className="block px-2 pt-4 pb-8 mt-2 bg-cover bg-no-repeat rounded-md bg-center bg-[--theme-color] bg-right"
        passHref
        style={{
          backgroundImage: "url('/homeworkBg.png')",
        }}
      >
        <div className="flex items-center justify-between ">
          <h2 className="font-semibold text-white text-lg w-full truncate">
            {joinedRoom.room.name}
          </h2>
          <Image
            src={joinedRoom.room.admin.image as string}
            height={45}
            width={45}
            className="border-4 rounded-full border-slate-100 bg-[--theme-color]"
            referrerPolicy="no-referrer"
            alt="Admin"
          />
        </div>
        <h3 className="-mt-2 text-sm text-slate-50 truncate">
          {joinedRoom.room.section}
        </h3>
      </Link>
      <div className="p-2 mt-2 flex justify-between items-center">
        <h2>{joinedRoom.room.admin.name}</h2>

        <RoomJoinOptions code={joinedRoom.room.code} />
      </div>
    </div>
  );
};

export default Room;
