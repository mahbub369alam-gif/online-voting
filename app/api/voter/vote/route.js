import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { voterId, candidateId } = await req.json();

    // Check if the voter has already voted
    const voter = await prisma.voter.findUnique({
      where: { voterId },
    });

    if (!voter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    if (voter.hasVoted) {
      return NextResponse.json(
        { error: "Voter has already voted" },
        { status: 400 }
      );
    }

    // Update the candidate's vote count
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    // Mark the voter as voted
    await prisma.voter.update({
      where: { voterId },
      data: {
        hasVoted: true,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cast vote" },
      { status: 500 }
    );
  }
}
