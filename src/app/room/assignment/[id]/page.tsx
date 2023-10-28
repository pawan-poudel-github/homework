import DeleteAssignment from "@/components/client/DeleteAssignment";
import EditAssignment from "@/components/client/EditAssignment";
import { badgeVariants } from "@/components/ui/badge";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { formatFileSize, getDownloadUrl } from "@edgestore/react/utils";
import { DownloadCloud, Eye } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FileIcon, defaultStyles } from "react-file-icon";
import type { Metadata } from "next";
import BackButton from "@/components/client/BackButton";

export const metadata: Metadata = {
  title: "Assignment - Homework",
  description: "View or manage assignment.",
};
const page = async ({
  searchParams,
  params,
}: {
  params: {
    id: string;
  };
  searchParams: {
    roomid: string;
  };
}) => {
  const session = await getServerSession(authOptions);
  const { roomid } = searchParams;
  const { id } = params;

  if (!roomid || !id) {
    return notFound();
  }
  const userInRoom = await db.roomEnrolled.findFirst({
    where: {
      roomId: roomid,
      userId: session?.user.id,
    },
  });
  if (!userInRoom) {
    return notFound();
  }

  const assignment = await db.assignment.findFirst({
    where: {
      id: id,
      roomId: roomid,
    },
    include: {
      user: true,
      room: true,
    },
  });
  if (!assignment) {
    return notFound();
  }

  const assignmentFiles = await db.assignmentFiles.findMany({
    where: {
      assignmentId: assignment?.id,
    },
  });
  function getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return fileName.substring(lastDotIndex + 1);
    } else {
      return "file";
    }
  }

  let assignmentElements = assignmentFiles.map((assg) => {
    let dynamicStyle = defaultStyles[getFileExtension(assg.name)];

    return (
      <section
        key={assg.id}
        className="flex items-center gap-x-3 p-4 shadow-sm rounded-md  w-fit"
      >
        <div className="h-6 w-6">
          <FileIcon extension={getFileExtension(assg.name)} {...dynamicStyle} />
        </div>
        <div>
          <p className="text-sm">
            {assg.name.substring(0, 18)} -{" "}
            <i className="text-xs">{formatFileSize(assg.size)}</i>
          </p>

          <div className="flex gap-x-4 mt-1">
            <a
              href={assg.url}
              target="_blank"
              title="View"
              className={badgeVariants({ variant: "secondary" })}
            >
              <Eye size={18} color="#212121" />
            </a>
            <a
              href={getDownloadUrl(assg.url)}
              title="Download"
              className={badgeVariants({ variant: "secondary" })}
            >
              <DownloadCloud size={18} color="#212121" />
            </a>
          </div>
        </div>
      </section>
    );
  });
  const canMoifyAssignment =
    assignment.user.id == session?.user.id ||
    assignment.room.adminId == session?.user.id;
  return (
    <div className="container relative mt-24 md:px-28">
      <BackButton />
      <div>
        <div className="flex items-start gap-x-4 w-full">
          <Image
            width={45}
            height={45}
            src={assignment?.user.image as string}
            alt={assignment?.user.name!}
            className="rounded-full"
          />
          <div>
            <h2 className="capitalize font-medium">{assignment?.title}</h2>
            <p className="text-xs italic">
              {assignment?.created_at.toDateString()}
            </p>
            {canMoifyAssignment && (
              <div className="space-x-2">
                <EditAssignment
                  title={assignment.title}
                  description={assignment.description!}
                  assgId={assignment.id}
                />
                <DeleteAssignment assgId={assignment.id} />
              </div>
            )}
          </div>
        </div>
        <br />
        <hr />
        <div className="sm:ml-16 mt-1">
          <p className="text-justify">{assignment?.description}</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 px-10">
          {assignmentElements}
        </div>
      </div>
    </div>
  );
};

export default page;
