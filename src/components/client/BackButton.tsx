"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
const BackButton = () => {
  const router = useRouter();
  return (
    <div className="mb-2">
      <Button onClick={() => router.back()} variant="ghost">
        <ArrowLeft size={18} />
      </Button>
    </div>
  );
};

export default BackButton;
