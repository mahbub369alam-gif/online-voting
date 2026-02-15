import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const elections = await prisma.election.findMany({
      include: {
        _count: {
          select: {
            candidates: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(elections);
  } catch (error) {
    console.error("Error fetching elections:", error);
    return NextResponse.json(
      { error: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { title, description, startTime, endTime, isActive } =
      await req.json();

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, start time and end time are required" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // If setting as active, deactivate other elections
    if (isActive) {
      await prisma.election.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const newElection = await prisma.election.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        isActive: isActive || false,
      },
    });

    return NextResponse.json(newElection, { status: 201 });
  } catch (error) {
    console.error("Error creating election:", error);
    return NextResponse.json(
      { error: "Failed to create election" },
      { status: 500 }
    );
  }
}
