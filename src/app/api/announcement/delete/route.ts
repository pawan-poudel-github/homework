import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { edgeStoreClient } from "@/lib/edgeStoreClient";
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
    const { assgId } = (await req.json()) as {
      assgId: string;
    };
    if (!assgId) {
      return NextResponse.json(
        {
          success: false,
          message: "Can't continue without room id.",
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
          message: "Can't found room, try again.",
        },
        { status: 400 }
      );
    }
    const canDeleteAssignment =
      assignment.userId == session.user.id ||
      assignment.room.adminId == session.user.id;
    if (!canDeleteAssignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Your are not authorized to perform this.",
        },
        { status: 401 }
      );
    }

    const assignmentFiles = await db.assignmentFiles.findMany({
      where: {
        assignmentId: assgId,
      },
    });
    assignmentFiles.forEach((assignment) => {
      edgeStoreClient.roomFiles.deleteFile({
        url: assignment.url,
      });
    });

    await db.assignmentFiles.deleteMany({
      where: {
        assignmentId: assgId,
      },
    });

    await db.assignment.delete({
      where: {
        id: assgId,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Assignment deleted successfully.",
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
