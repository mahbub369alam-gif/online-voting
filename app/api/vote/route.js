import prisma from "@/lib/prisma";
import { notifyAllVoters, notifyVoteUpdate } from "@/lib/socket-notify";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { voterId, electionId, votes } = await req.json();

    if (!voterId || !electionId || !votes || !Array.isArray(votes)) {
      return NextResponse.json(
        { error: "Voter ID, election ID and votes array are required" },
        { status: 400 },
      );
    }

    // Check if voter exists
    const voter = await prisma.voter.findUnique({
      where: { id: voterId },
    });

    if (!voter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    // Check if election exists and is active
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 },
      );
    }

    if (!election.isActive) {
      return NextResponse.json(
        { error: "Election is not active" },
        { status: 400 },
      );
    }

    // Check if voting period is valid
    const now = new Date();
    if (now < election.startTime || now > election.endTime) {
      return NextResponse.json(
        { error: "Voting is not open at this time" },
        { status: 400 },
      );
    }

    // Check if voter has already voted in this election
    const existingVotes = await prisma.vote.findMany({
      where: {
        voterId,
        electionId,
      },
    });

    if (existingVotes.length > 0) {
      return NextResponse.json(
        { error: "You have already voted in this election" },
        { status: 400 },
      );
    }

    // Validate votes - one per category
    const categoryIds = votes.map((v) => v.categoryId);
    const uniqueCategories = new Set(categoryIds);

    if (categoryIds.length !== uniqueCategories.size) {
      return NextResponse.json(
        { error: "Cannot vote for multiple candidates in same category" },
        { status: 400 },
      );
    }

    // Insert votes (avoid MongoDB transaction requirement on some deployments)
    // We rely on the existing validation + unique constraint to prevent double voting.
    await prisma.vote.createMany({
      data: votes.map((vote) => ({
        voterId,
        candidateId: vote.candidateId,
        electionId,
        categoryId: vote.categoryId,
      })),
    });

    // Get updated election results for real-time broadcast
    try {
      const updatedResults = await getElectionResults(electionId);

      // Notify Socket.io server about the vote update
      await notifyVoteUpdate({
        type: "VOTE_CAST",
        electionId,
        voterId,
        timestamp: new Date().toISOString(),
        results: updatedResults,
      });

      if (election.isLive) {
        // Notify all voters about the vote update
        await notifyAllVoters({
          type: "VOTE_CAST",
          electionId,
          voterId,
          timestamp: new Date().toISOString(),
          results: updatedResults,
        });
      }
    } catch (notifyError) {
      console.error("Failed to send real-time notifications:", notifyError);
      // Don't fail the request if notifications fail
    }

    // Return results so the client can render a proper success screen
    const finalResults = await getElectionResults(electionId);
    return NextResponse.json(
      { success: true, message: "Vote submitted successfully", results: finalResults },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote", details: error?.message },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    // get search params
    const searchParams = request.nextUrl.searchParams;
    const electionId = searchParams.get("electionId");
    const votes = await prisma.vote.findMany({
      where: {
        electionId,
      },
    });
    return NextResponse.json(votes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 },
    );
  }
}

// Helper function to get election results
async function getElectionResults(electionId) {
  try {
    const election = await prisma.election.findUnique({
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
        votes: true,
      },
    });

    if (!election) return null;

    const votes = await prisma.vote.findMany({
      where: {
        electionId: electionId,
      },
    });

    // Group candidates by category and calculate winners
    const resultsByCategory = {};

    election.candidates.forEach(({ candidate }) => {
      const categoryId = candidate.categoryId;
      if (!resultsByCategory[categoryId]) {
        resultsByCategory[categoryId] = {
          category: candidate.category,
          candidates: [],
          totalVotes: 0,
        };
      }

      resultsByCategory[categoryId].candidates.push({
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        imageUrl: candidate.imageUrl,
        votes: votes.filter((vote) => vote.candidateId === candidate.id).length,
        ballotNumber: candidate.ballotNumber,
      });

      resultsByCategory[categoryId].totalVotes += votes.filter(
        (vote) => vote.candidateId === candidate.id,
      ).length;
    });

    // Sort candidates by votes and determine winners
    Object.keys(resultsByCategory).forEach((categoryId) => {
      resultsByCategory[categoryId].candidates.sort(
        (a, b) => b.votes - a.votes,
      );

      // Calculate percentages
      const totalVotes = resultsByCategory[categoryId].totalVotes;
      resultsByCategory[categoryId].candidates = resultsByCategory[
        categoryId
      ].candidates.map((candidate) => ({
        ...candidate,
        percentage:
          totalVotes > 0
            ? ((candidate.votes / totalVotes) * 100).toFixed(2)
            : 0,
      }));

      // Mark winner
      if (resultsByCategory[categoryId].candidates.length > 0) {
        resultsByCategory[categoryId].winner =
          resultsByCategory[categoryId].candidates[0];
      }
    });

    return {
      election: {
        id: election.id,
        title: election.title,
        startTime: election.startTime,
        endTime: election.endTime,
        totalVotes: election.votes.length,
      },
      results: Object.values(resultsByCategory),
    };
  } catch (error) {
    console.error("Error getting election results:", error);
    return null;
  }
}
