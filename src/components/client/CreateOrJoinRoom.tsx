"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Loader2, LogIn, PenSquare, Plus } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "awesome-toast-component";
import axios from "axios";
import { RoomApiResponse } from "@/types/Room";

const ManageRoom = () => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [roomSection, setRoomSection] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const joinRoom = async (e: FormEvent) => {
    e.preventDefault();
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
        setDialogOpen(false);
        router.refresh();
        setRoomCode("");
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
  const createRoom = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data }: { data: RoomApiResponse } = await axios.post(
        "/api/room/create",
        {
          name: roomName,
          section: roomSection,
        }
      );
      if (data.success) {
        new Toast(data.message, {
          style: {
            container: [["background-color", "green"]],
            message: [["color", "#eee"]],
            bold: [["font-weight", "bold"]],
          },
        });
        setRoomName("");
        setRoomSection("");
        setDialogOpen(false);
        router.refresh();
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
      new Toast("Error Creating Room, try again.", {
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="flex justify-center items-center rounded-full w-9 h-9 bg-[--theme-color] text-white hover:opacity-90"
          title="Create or join room"
          aria-label="Create or join room"
        >
          <Plus className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Manage Rooms</DialogTitle>
          <DialogDescription>Join or create a new room.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="join">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="join">Join</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
          </TabsList>
          <TabsContent value="join">
            <Card className="py-2">
              <form onSubmit={joinRoom}>
                <CardContent className="space-y-2  ">
                  <div className="space-y-1">
                    <Label htmlFor="code">Room Code</Label>
                    <Input
                      autoComplete="off"
                      id="code"
                      placeholder="Enter code to join"
                      required
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2
                        className="mr-2 animate-spin"
                        size={16}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <LogIn size={16} strokeWidth={2.5} className="mr-2" />
                    )}
                    Join
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="create">
            <Card>
              <form onSubmit={createRoom}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                      placeholder="Subject or Room name"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="section">Room Section</Label>
                    <Input
                      id="section"
                      type="text"
                      value={roomSection}
                      onChange={(e) => setRoomSection(e.target.value)}
                      required
                      placeholder="Section"
                      autoComplete="off"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2
                        className="mr-2 animate-spin"
                        size={16}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <PenSquare size={16} strokeWidth={2.5} className="mr-2" />
                    )}
                    Create
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManageRoom;
