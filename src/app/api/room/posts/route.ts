import { db } from "@/lib/db";
import { AssignmentPost } from "@/types/Room";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<AssignmentPost>> => {
  try {
    const {
      roomId,
      page,
    }: {
      roomId: string;
      page: number;
    } = await req.json();

    let limit = 10;
    const skip = (page - 1) * limit;
    const posts = await db.assignment.findMany({
      skip,
      take: limit,
      where: {
        roomId,
      },
      include: {
        user: true,
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
    });
    const totalPosts = await db.assignment.count({
      where: {
        roomId,
      },
    });

    const totalPages = Math.ceil(totalPosts / limit);
    return NextResponse.json(
      {
        success: true,
        message: "Post loaded successfully",
        totalPages,
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Can't get posts, reload again.",
      },
      { status: 500 }
    );
  }
};
