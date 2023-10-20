"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Account = ({ image }: { image: string }) => {
  const router = useRouter();
  const logout = () => {
    signOut({
      redirect: true,
    }).then(() => {
      router.refresh();
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={image}
          height={40}
          width={40}
          referrerPolicy="no-referrer"
          className="rounded-full"
          alt="user"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2" onClick={logout}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Account;
