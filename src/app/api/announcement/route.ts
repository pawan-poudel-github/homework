import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { RoomApiResponse, UploadedFile } from "@/types/Room";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (
  req: NextRequest
): Promise<NextResponse<RoomApiResponse>> => {
  try {
    const session = await getServerSession(authOptions);
    const { title, description, roomId, files } = (await req.json()) as {
      title: string;
      description: string;
      roomId: string;
      files?: UploadedFile[];
    };
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Login to continue.",
        },
        { status: 401 }
      );
    }
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 200,
        }
      );
    }
    const dbRoom = await db.room.findFirst({
      where: {
        id: roomId,
      },
    });
    if (!dbRoom) {
      return NextResponse.json(
        {
          success: false,
          message: "Can't find the room, try reloading page..",
        },
        {
          status: 200,
        }
      );
    }

    if (!dbRoom.canStudentPost) {
      if (!(session?.user.id == dbRoom.adminId)) {
        return NextResponse.json(
          {
            success: false,
            message: "User not authorized to post.",
          },
          {
            status: 200,
          }
        );
      }
    }

    const newAssignment = await db.assignment.create({
      data: {
        title,
        description,
        roomId,
        userId: session?.user.id,
      },
    });

    const assignmentWithUser = await db.assignment.findFirst({
      where: {
        id: newAssignment.id,
      },
      include: {
        user: true,
      },
    });
    await pusherServer.trigger(roomId, "newpost", assignmentWithUser);
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        await db.assignmentFiles.create({
          data: {
            name: files[i].name,
            size: files[i].size,
            url: files[i].url,
            assignmentId: newAssignment.id,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Announced successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
};
