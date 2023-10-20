"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { RoomApiResponse } from "@/types/Room";
import axios from "axios";
import Toast from "awesome-toast-component";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const InvitationJoin = ({ roomCode }: { roomCode: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const joinRoom = async () => {
    setLoading(true);
    try {
      const { data }: { data: RoomApiResponse } = await axios.post(
        "/api/room/join",
        { code: roomCode }
      );
      if (data.success) {
        new Toast(data.message, {
          style: {
            container: [["background-color", "green"]],
            message: [["color", "#eee"]],
            bold: [["font-weight", "bold"]],
          },
        });
        router.replace("/");
      } else {
        new Toast(data.message, {
          style: {
            container: [["background-color", "red"]],
            message: [["color", "#eee"]],
            bold: [["font-weight", "bold"]],
          },
        });
      }
    } catch (error) {
      new Toast("Error Joining Room, try again.", {
        style: {
          container: [["background-color", "red"]],
          message: [["color", "#eee"]],
          bold: [["font-weight", "bold"]],
        },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={loading}
      className="w-full text-center text-lg py-5 rounded-sm bg-[#007991] hover:bg-[#007997] flex item-center justify-center gap-x-2"
      onClick={joinRoom}
    >
      Accept Invitation
      {loading && <Loader2 width={16} className="animate-spin" />}
    </Button>
  );
};

export default InvitationJoin;
