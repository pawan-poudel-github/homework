import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import AnnounceForm from "../client/AnnounceForm";
const Announce = async ({ roomId }: { roomId: string }) => {
  const session = await getServerSession(authOptions);
  return <AnnounceForm roomId={roomId} userImage={session?.user.image!} />;
};

export default Announce;
