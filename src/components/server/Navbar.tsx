import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Account from "../client/Account";
import ManageRoom from "../client/CreateOrJoinRoom";
import { Button } from "../ui/button";
import { Home } from "lucide-react";
const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav className="fixed top-0 left-0 w-full py-2 shadow-sm z-10 bg-white ">
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-lg flex items-center gap-x-2"
        >
          <Home size={20} />
          Homework
        </Link>
        {session ? (
          <div className="flex items-center gap-x-4">
            <ManageRoom />
            <Account image={session.user.image!} />
          </div>
        ) : (
          <Link href="/signin">
            <Button>Signin</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
