import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const electionId = params?.id;

    if (!electionId) {
      return Response.json(
        { success: false, error: "Election id is required" },
        { status: 400 }
      );
    }

    // 1) Load election with candidates + categories
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        candidates: {
          include: {
            candidate: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!election) {
      return Response.json(
        { success: false, error: "Election not found" },
        { status: 404 }
      );
    }

    // 2) Load all votes for this election
    const votes = await prisma.vote.findMany({
      where: { electionId },
      select: { candidateId: true, categoryId: true },
    });

    // 3) Build category map
    const categoryMap = new Map(); // categoryId -> { category, candidates: [] }

    for (const ec of election.candidates || []) {
      const c = ec?.candidate;
      if (!c?.category?.id) continue;

      const catId = c.category.id;

      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          category: {
            id: c.category.id,
            name: c.category.name,
            displayName: c.category.displayName,
            description: c.category.description,
          },
          candidates: [],
        });
      }

      categoryMap.get(catId).candidates.push({
        id: c.id,
        name: c.name,
        party: c.party,
        ballotNumber: c.ballotNumber,
        imageUrl: c.imageUrl,
        categoryId: catId,
      });
    }

    // 4) Count votes safely (no groupBy)
    const countByCandidate = new Map(); // candidateId -> count
    const countByCategory = new Map();  // categoryId -> total votes in that category

    for (const v of votes) {
      if (!v?.candidateId || !v?.categoryId) continue;

      countByCandidate.set(v.candidateId, (countByCandidate.get(v.candidateId) || 0) + 1);
      countByCategory.set(v.categoryId, (countByCategory.get(v.categoryId) || 0) + 1);
    }

    // 5) Build results per category
    const results = Array.from(categoryMap.values()).map((group) => {
      const catId = group.category.id;
      const total = countByCategory.get(catId) || 0;

      const candidatesWithVotes = (group.candidates || [])
        .map((cand) => {
          const vcount = countByCandidate.get(cand.id) || 0;
          const percentage = total > 0 ? Math.round((vcount / total) * 100) : 0;
          return { ...cand, votes: vcount, percentage };
        })
        .sort((a, b) => b.votes - a.votes);

      const winner = candidatesWithVotes.length ? candidatesWithVotes[0] : null;

      return {
        category: group.category,
        totalVotes: total,
        candidates: candidatesWithVotes,
        winner,
      };
    });

    return Response.json({
      success: true,
      election: {
        id: election.id,
        title: election.title,
        startTime: election.startTime,
        endTime: election.endTime,
        isActive: election.isActive,
        isLive: election.isLive,
      },
      results,
    });
  } catch (err) {
    console.error("[RESULTS API ERROR]", err);
    return Response.json(
      { success: false, error: "Failed to load results" },
      { status: 500 }
    );
  }
}
