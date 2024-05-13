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
    const { name, section, roomId } = (await req.json()) as {
      name: string;
      section: string;
      roomId: string;
    };
    if (!name || !section) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
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
        name,
        section,
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
