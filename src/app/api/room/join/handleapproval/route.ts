import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { RoomApiResponse } from "@/types/Room";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
type PendingRoom = {
  id: string;
  userId: string;
  roomId: string;
  approved: boolean;
  created_at: Date;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
};
export async function POST(
  req: NextRequest
): Promise<NextResponse<RoomApiResponse>> {
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
    const {
      pendingRoom,
      approve,
    }: {
      pendingRoom: PendingRoom;
      approve: boolean;
    } = await req.json();

    if (!pendingRoom || !approve) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request try again later.",
        },
        { status: 400 }
      );
    }

    const roomEnrollment = await db.roomEnrolled.findFirst({
      where: {
        id: pendingRoom.id,
        approved: false,
        roomId: pendingRoom.roomId,
      },
    });
    if (!roomEnrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "Soemthing went wrong, refresh page again.",
        },
        {
          status: 200,
        }
      );
    }

    if (approve) {
      await db.roomEnrolled.update({
        where: {
          id: roomEnrollment.id,
        },
        data: {
          approved: true,
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "User request is approved.",
        },
        {
          status: 200,
        }
      );
    } else {
      await db.roomEnrolled.delete({
        where: {
          id: roomEnrollment.id,
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "User request is declined.",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
