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
    const { approval, roomId } = (await req.json()) as {
      approval: boolean;
      roomId: string;
    };

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
    if (!(dbRoom.adminId == session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Your are not authorized to perform this.",
        },
        { status: 401 }
      );
    }
    await db.room.update({
      where: {
        id: roomId,
      },
      data: {
        approval: approval,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Room Updated successfully.",
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
