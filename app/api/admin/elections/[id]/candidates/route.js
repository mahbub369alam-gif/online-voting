import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ Add candidates to election
export async function POST(req, props) {
  const params = await props.params;
  try {
    const { candidateIds } = await req.json();

    if (!candidateIds || !Array.isArray(candidateIds)) {
      return NextResponse.json(
        { error: "Candidate IDs array is required" },
        { status: 400 }
      );
    }

    const electionId = params.id;

    // Step 1: Check if election exists
    const electionExists = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!electionExists) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    // Step 2: Create relations (ignore duplicates)
    const existingRelations = await prisma.electionCandidate.findMany({
      where: { electionId },
      select: { candidateId: true },
    });

    const existingIds = existingRelations.map((r) => r.candidateId);
    const newIds = candidateIds.filter((id) => !existingIds.includes(id));

    if (newIds.length === 0) {
      return NextResponse.json({ message: "All candidates already linked" });
    }

    // Step 3: Create new relation entries
    await prisma.electionCandidate.createMany({
      data: newIds.map((candidateId) => ({
        electionId,
        candidateId,
      })),
    });

    // Step 4: Return updated election with candidates
    const updatedElection = await prisma.election.findUnique({
      where: { id: electionId },
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
      },
    });

    return NextResponse.json(updatedElection);
  } catch (error) {
    console.error("Error adding candidates to election:", error);
    return NextResponse.json(
      { error: "Failed to add candidates to election" },
      { status: 500 }
    );
  }
}

// ✅ Remove candidate from election
export async function DELETE(req, props) {
  const params = await props.params;
  try {
    const { candidateId } = await req.json();
    const electionId = params.id;

    if (!candidateId) {
      return NextResponse.json(
        { error: "Candidate ID is required" },
        { status: 400 }
      );
    }

    // Step 1: Delete the junction record
    await prisma.electionCandidate.deleteMany({
      where: {
        electionId,
        candidateId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing candidate from election:", error);
    return NextResponse.json(
      { error: "Failed to remove candidate from election" },
      { status: 500 }
    );
  }
}
