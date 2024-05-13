"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEdgeStore } from "@/lib/edgeStore";
import { UploadedFile } from "@/types/Room";
import Toast from "awesome-toast-component";
import axios from "axios";
import { Loader2, PenSquare } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
const AnnounceForm = ({
  roomId,
  userImage,
}: {
  roomId: string;
  userImage: string;
}) => {
  const { edgestore } = useEdgeStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const announce = async (uploadedFilesArray: UploadedFile[]) => {
    try {
      const { data } = await axios.post("/api/announcement", {
        title,
        description,
        roomId,
        files: uploadedFilesArray,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };
      if (data.success) {
        setTitle("");
        setDescription("");
        setDialogOpen(false);
      } else {
        new Toast(data.message, { style: toastStyle });
      }
    } catch (error) {
      new Toast("Can't process, try again later.", {
        style: {
          container: [["background-color", "#d0052a"]],
          message: [["color", "#fff"]],
          bold: [["font-weight", "bold"]],
        },
      });
    }
  };

  const handleAnnounce = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uploadedFilesArray = [];
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let res = await edgestore.roomFiles.upload({
            file: files[i],
          });
          uploadedFilesArray.push({ ...res, name: files[i].name });
        }
      }
      await announce(uploadedFilesArray);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileSizeInMB = file.size / (1024 * 1024);

        if (fileSizeInMB > 30) {
          new Toast(`Error: File "${file.name}" is larger than 30 MB.`, {
            style: {
              container: [["background-color", "#d0052a"]],
              message: [["color", "#fff"]],
              bold: [["font-weight", "bold"]],
            },
          });
          e.target.value = "";
          return;
        }
      }

      setFiles(selectedFiles);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center p-2 mt-2 border border-gray-200 rounded-full cursor-pointer gap-x-3 hover:shadow-sm">
          <Image
            src={userImage}
            alt="user"
            height={35}
            width={35}
            className="rounded-full border-[--theme-color] border-2"
            referrerPolicy="no-referrer"
          />
          <p className="text-sm opacity-80">Announce something to the class.</p>
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Announce to your class.</DialogTitle>
          <DialogDescription>
            Upload a assignment to the class.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent>
            <form onSubmit={handleAnnounce} className="mt-2">
              <div className="grid gap-y-2">
                <Input
                  placeholder="Enter assignment title here..."
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoComplete="off"
                />
                <Textarea
                  placeholder="Enter assignment description here..."
                  rows={8}
                  className="resize-none"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-2 gap-x-2">
                <Input
                  type="file"
                  className="cursor-pointer max-w-sm"
                  multiple={true}
                  onChange={handleFileChange}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <Loader2
                      className="mr-2 animate-spin"
                      size={16}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <PenSquare size={16} className="mr-1" strokeWidth={2} />
                  )}
                  Create Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AnnounceForm;
