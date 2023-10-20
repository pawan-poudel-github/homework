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
    const { roomId } = (await req.json()) as {
      roomId: string;
    };
    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          message: "Can't continue without room id.",
        },
        { status: 200 }
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
          message: "Can't found room, try again.",
        },
        { status: 400 }
      );
    }
    if (dbRoom.adminId == session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Can't leave own room.",
        },
        { status: 401 }
      );
    }
    const roomEnrolled = await db.roomEnrolled.findFirst({
      where: {
        roomId,
        userId: session.user.id,
      },
    });
    if (!roomEnrolled) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not in room, refresh page again.",
        },
        { status: 400 }
      );
    }
    await db.roomEnrolled.delete({
      where: {
        id: roomEnrolled.id,
        roomId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "You have left the room.",
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
