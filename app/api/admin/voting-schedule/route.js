import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const votingSchedules = await prisma.votingSchedule.findMany();
    return NextResponse.json(votingSchedules);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch voting schedules" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { title, description, startTime, endTime } = await req.json();
    const newVotingSchedule = await prisma.votingSchedule.create({
      data: {
        title,
        description,
        startTime,
        endTime,
      },
    });
    return NextResponse.json(newVotingSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create voting schedule" },
      { status: 500 }
    );
  }
}
