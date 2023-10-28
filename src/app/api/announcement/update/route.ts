import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { RoomApiResponse } from "@/types/Room";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<RoomApiResponse>> => {
  const session = await getServerSession(authOptions);

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Login to continue.",
        },
        { status: 401 }
      );
    }
    const { title, description, assgId } = (await req.json()) as {
      title: string;
      description: string;
      assgId: string;
    };
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 200 }
      );
    }

    const assignment = await db.assignment.findFirst({
      where: {
        id: assgId,
      },
      include: {
        room: true,
      },
    });
    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot find assignment.",
        },
        { status: 200 }
      );
    }

    const canUpdateAssignment =
      assignment.userId == session.user.id ||
      assignment.room.adminId == session.user.id;
    if (!canUpdateAssignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Your are not authorized to perform this.",
        },
        { status: 401 }
      );
    }
    await db.assignment.update({
      where: { id: assignment?.id },
      data: { title, description },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Post Updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error,try again.",
      },
      { status: 500 }
    );
  }
};
