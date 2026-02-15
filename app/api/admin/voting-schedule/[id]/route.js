import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const votingSchedule = await prisma.votingSchedule.findUnique({
      where: { id: params.id },
    });
    if (!votingSchedule) {
      return NextResponse.json(
        { error: "Voting schedule not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(votingSchedule);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch voting schedule" },
      { status: 500 }
    );
  }
}

export async function PUT(req, props) {
  const params = await props.params;
  try {
    const { title, description, startTime, endTime, status } = await req.json();
    const updatedVotingSchedule = await prisma.votingSchedule.update({
      where: { id: params.id },
      data: {
        title,
        description,
        startTime,
        endTime,
        status,
      },
    });
    return NextResponse.json(updatedVotingSchedule);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update voting schedule" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    await prisma.votingSchedule.delete({
      where: { id: params.id },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete voting schedule" },
      { status: 500 }
    );
  }
}
