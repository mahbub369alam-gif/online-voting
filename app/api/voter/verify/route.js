import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { voterId } = await req.json();

    const voter = await prisma.voter.findUnique({
      where: { voterId },
    });

    if (!voter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    return NextResponse.json(voter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify voter" },
      { status: 500 }
    );
  }
}
