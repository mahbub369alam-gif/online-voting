import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const election = await prisma.election.findUnique({
      where: { id: params.id },
      include: {
        candidates: {
          include: {
            candidate: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(election);
  } catch (error) {
    console.error("Error fetching election:", error);
    return NextResponse.json(
      { error: "Failed to fetch election" },
      { status: 500 }
    );
  }
}

export async function PUT(req, props) {
  const params = await props.params;
  try {
    const { title, description, startTime, endTime, isActive } =
      await req.json();

    const updateData = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate dates if both provided
    if (updateData.startTime && updateData.endTime) {
      if (updateData.startTime >= updateData.endTime) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 }
        );
      }
    }

    // If setting as active, deactivate other elections
    if (isActive) {
      await prisma.election.updateMany({
        where: {
          isActive: true,
          id: { not: params.id },
        },
        data: { isActive: false },
      });
    }

    const updatedElection = await prisma.election.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedElection);
  } catch (error) {
    console.error("Error updating election:", error);
    return NextResponse.json(
      { error: "Failed to update election" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    // Check if election has votes
    const election = await prisma.election.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    if (election._count.votes > 0) {
      return NextResponse.json(
        { error: "Cannot delete election with existing votes" },
        { status: 400 }
      );
    }

    // Remove election reference from candidates
    await prisma.electionCandidate.deleteMany({
      where: { electionId: params.id },
    });

    await prisma.election.delete({
      where: { id: params.id },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error deleting election:", error);
    return NextResponse.json(
      { error: "Failed to delete election" },
      { status: 500 }
    );
  }
}
