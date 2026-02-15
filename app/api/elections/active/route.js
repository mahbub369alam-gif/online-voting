import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const activeElection = await prisma.election.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        isActive: true,
        isLive: true,
        faceVerification: true,
        otpVerification: true,
        candidates: {
          include: {
            candidate: {
              include: {
                category: true,
              },
            },
          },
        },
        votes: true,
      },
    });

    if (!activeElection) {
      return NextResponse.json(
        { error: "No active election found" },
        { status: 404 }
      );
    }

    // check if the start time and end time are valid
    if (
      activeElection.startTime > new Date() ||
      activeElection.endTime < new Date()
    ) {
      return NextResponse.json(
        { error: "No active election found" },
        { status: 400 }
      );
    }

    return NextResponse.json({ isOpen: true, ...activeElection });
  } catch (error) {
    console.error("Error fetching active election:", error);
    return NextResponse.json(
      { error: "Failed to fetch election settings" },
      { status: 500 }
    );
  }
}
