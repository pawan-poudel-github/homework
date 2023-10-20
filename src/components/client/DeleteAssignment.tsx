"use client";
import { Trash2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const DeleteAssignment = ({ assgId }: { assgId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const DeleteAssignment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/announcement/delete", {
        assgId,
      });
      const toastStyle = {
        container: [["background-color", data.success ? "#00a600" : "#d0052a"]],
        message: [["color", "#fff"]],
        bold: [["font-weight", "bold"]],
      };

      new Toast(data.message, { style: toastStyle });
      if (data.success) {
        router.replace("/");
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
    <AlertDialog>
      <AlertDialogTrigger className="p-2 px-4  hover:bg-slate-100 rounded-md">
        <Trash2 color="#ff1a1a" size={18} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={DeleteAssignment} disabled={loading}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAssignment;
