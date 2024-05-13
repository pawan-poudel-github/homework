"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Room } from "@prisma/client";
import Toast from "awesome-toast-component";
import axios from "axios";
import { ChevronsDownUp, UserCheck, UserX, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Image from "next/image";
import { RoomApiResponse } from "@/types/Room";

type PendingRoom = {
  id: string;
  userId: string;
  roomId: string;
  approved: boolean;
  created_at: Date;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
};

const RoomAdmin = ({
  room,
  pendingJoinedUsers,
}: {
  room: Room;
  pendingJoinedUsers: PendingRoom[] | [];
}) => {
  const [studentCanPostChecked, setStudentCanPostChecked] = useState<boolean>(
    room.canStudentPost
  );
  const [approval, setApproval] = useState<boolean>(room.approval);
  const [roomName, setRoomName] = useState(room.name);
  const [roomSection, setRoomSection] = useState(room.section);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleRoomUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (roomName == room.name && roomSection == room.section) {
        new Toast("Nothing to update!");
        return;
      }
      const { data } = await axios.post("/api/room/update", {
        name: roomName,
        section: roomSection,
        roomId: room.id,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        router.refresh();
      }
    } catch (error) {
      new Toast("Can't process, try again later.", {
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

  const toggleStudentRole = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/room/update/studentcanpost", {
        studentCanPost: !studentCanPostChecked,
        roomId: room.id,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        setStudentCanPostChecked((prev) => !prev);
        router.refresh();
      }
    } catch (error) {
      new Toast("Can't process, try again later.", {
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
  const handleJoinApproval = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/room/update/approval", {
        approval: !approval,
        roomId: room.id,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        setApproval((prev) => !prev);
        router.refresh();
      }
    } catch (error) {
      new Toast("Can't process, try again later.", {
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

  const deleteRoom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/room/delete", {
        roomId: room.id,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        location.replace(location.origin);
      }
    } catch (error) {
      new Toast("Can't process, try again later.", {
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

  const handleApproval = async (room: PendingRoom, approve: boolean) => {
    setLoading(true);
    try {
      const { data }: { data: RoomApiResponse } = await axios.post(
        "/api/room/join/handleapproval",
        {
          pendingRoom: room,
          approve,
        }
      );
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        router.refresh();
      }
    } catch (error) {
      new Toast("Can't process, try again later.", {
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

  const pendingUsersElement = pendingJoinedUsers.map((item, index) => {
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
        <Button
          variant={"ghost"}
          title="Approve User"
          aria-label="Approve User"
          onClick={() => handleApproval(item, true)}
        >
          <UserCheck size={14} color="green" />
        </Button>
        <Button
          variant={"ghost"}
          title="Delete User"
          aria-label="Delete User"
          onClick={() => handleApproval(item, false)}
        >
          <UserX size={14} color="red" />
        </Button>
      </li>
    );
  });

  
  return (
    <div className="mt-8">
      <h2 className="font-medium flex items-center gap-x-2">
        <Wrench size={20} />
        Manage Room
      </h2>
      <div className="mt-3">
        <Collapsible>
          <CollapsibleTrigger>
            <h2 className="font-medium flex items-center gap-x-3 relative mb-1">
              Pending Users{" "}
              {pendingJoinedUsers.length > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 h-2 w-2 rounded-full"></span>
              )}
              <span className="block p-2 bg-gray-50 rounded-md">
                <ChevronsDownUp size={14} />
              </span>
            </h2>
          </CollapsibleTrigger>

          <hr />
          <CollapsibleContent>
            <ul>{pendingUsersElement}</ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <form className="grid space-y-2 mt-4" onSubmit={handleRoomUpdate}>
        <Input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Room Section"
          value={roomSection}
          onChange={(e) => setRoomSection(e.target.value)}
          required
        />
        <Button disabled={loading}>Apply Changes</Button>
      </form>
 
      <div className="flex justify-between items-center mt-4 ">
          <Label htmlFor="approval" className="text-base font-medium">
            Approval
          </Label>
          <Switch
            id="approval"
            checked={approval}
            onCheckedChange={handleJoinApproval}
            disabled={loading}
            title="User Join Approval"
            aria-label="Toggle approval for user"
          />
        </div>
        <div className="flex justify-between items-center mt-4 ">
          <Label htmlFor="student-can-post" className="text-base font-medium">
            Students Can Post
          </Label>
          <Switch
            id="student-can-post"
            checked={studentCanPostChecked}
            onCheckedChange={toggleStudentRole}
            disabled={loading}
          />
        </div>
      <div className="mt-4 border border-slate-200 px-2 py-4 rounded-md">
        <AlertDialog>
          <AlertDialogTrigger className="bg-red-600 hover:opacity-90 font-medium w-full mt-2 text-white rounded-md block p-2">
            Delete this room
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                room and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button disabled={loading} onClick={() => deleteRoom()}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
export default RoomAdmin;
