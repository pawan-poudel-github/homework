"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Toast from "awesome-toast-component";
import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/button";

export default function LeaveRoom({ roomId }: { roomId: string }) {
  const [loading, setLoading] = useState(false);
  const leaveRoom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/room/leave", {
        roomId,
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
  return (
    <div className="mt-4">
      <AlertDialog>
        <AlertDialogTrigger className="bg-red-600 hover:opacity-90 font-medium w-full mt-2 text-white rounded-md block p-2">
          Leave this room.
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to leave this room? You can join again if you want.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button disabled={loading} onClick={leaveRoom}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
