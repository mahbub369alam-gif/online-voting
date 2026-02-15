import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const election = await prisma.votingSchedule.findUnique({
      where: { id: params.id },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    const candidates = await prisma.candidate.findMany();

    return NextResponse.json({ election, candidates });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch election" },
      { status: 500 }
    );
  }
}
