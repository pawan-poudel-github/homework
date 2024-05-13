import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { RoomApiResponse } from "@/types/Room";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<RoomApiResponse>> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Login to continue.",
      },
      { status: 401 }
    );
  }
  try {
    const { code }: { code: string } = await req.json();

    if (!code && code.length != 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Room code is required.",
        },
        { status: 200 }
      );
    }
    const dbRoom = await db.room.findFirst({
      where: {
        code,
      },
    });
    if (!dbRoom) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid code.",
        },
        { status: 200 }
      );
    }
    const userInRoom = await db.roomEnrolled.findFirst({
      where: {
        roomId: dbRoom.id,
        userId: session?.user.id,
      },
    });
    if (userInRoom) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already joined the room.",
        },
        { status: 200 }
      );
    }
    if (dbRoom.approval) {
      await db.roomEnrolled.create({
        data: {
          roomId: dbRoom.id,
          userId: session?.user.id,
        },
      });
    } else {
      await db.roomEnrolled.create({
        data: {
          roomId: dbRoom.id,
          userId: session?.user.id,
          approved: true,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Requested to joined room " + dbRoom.name,
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
