"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import Toast from "awesome-toast-component";
import { useRouter } from "next/navigation";

export default function EditAssignment({
  title,
  description,
  assgId,
}: {
  title: string;
  description: string;
  assgId: string;
}) {
  const [assgTitle, setAssgTitle] = useState(title);
  const [assgDesc, setAssgDesc] = useState(description);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (assgTitle == title && description == assgDesc) {
        new Toast("Nothing to update!");
        return;
      }
      const { data } = await axios.post("/api/announcement/update", {
        title: assgTitle,
        description: assgDesc,
        assgId,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        setDialogOpen(false);
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

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil color="#341aff" size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handlePostUpdate}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              value={assgTitle}
              className="col-span-4"
              onChange={(e) => setAssgTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              placeholder="Enter assignment description here..."
              rows={8}
              className="resize-none col-span-4"
              name="description"
              value={assgDesc}
              onChange={(e) => setAssgDesc(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
