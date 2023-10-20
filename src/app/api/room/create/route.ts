import RoomCode from "@/lib/RoomCode";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { RoomApiResponse } from "@/types/Room";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<RoomApiResponse>> => {
  try {
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
    const { name, section } = (await req.json()) as {
      name: string;
      section: string;
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
        adminId: session.user.id,
        name,
        section,
      },
    });
    if (dbRoom) {
      return NextResponse.json(
        {
          success: false,
          message: "Room with same name and section already exist..",
        },
        { status: 200 }
      );
    }
    const newRoom = await db.room.create({
      data: {
        name,
        section,
        code: RoomCode(),
        adminId: session.user.id,
      },
    });
    if (newRoom) {
      await db.roomEnrolled.create({
        data: {
          roomId: newRoom.id,
          userId: session.user.id,
          approved: true,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "New rooom created.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
};
