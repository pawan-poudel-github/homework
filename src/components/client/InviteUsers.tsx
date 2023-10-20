"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Toast from "awesome-toast-component";
import { CopyIcon } from "lucide-react";

const RoomJoinOptions = ({ code }: { code: string }) => {
  const copy = (roomCode: string, method: string) => {
    if (method == "code") {
      navigator.clipboard.writeText(code);
    } else {
      navigator.clipboard.writeText(
        window.location.origin + "/invitation/" + code
      );
    }
    new Toast("Copied invitation " + method);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger title="Invite Users" aria-label="Invite Users">
          <span className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 block">
            <DotsVerticalIcon />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="p-1">Invite Users</DropdownMenuLabel>
          <hr />
          <DropdownMenuGroup className="mt-1">
            <DropdownMenuItem
              className="flex gap-x-2 items-center cursor-pointer py-2"
              onClick={() => copy(code, "code")}
              title="Copy Invitation Code"
            >
              <CopyIcon size={14} />
              Code
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-x-2 items-center cursor-pointer py-2"
              onClick={() => copy(code, "link")}
              title="Copy Invitation Link"
            >
              <CopyIcon size={14} />
              Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RoomJoinOptions;
