import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id: voterId } = params;

    const voter = await prisma.voter.findUnique({
      where: { voterId: voterId },
      select: {
        id: true,
        name: true,
        voterId: true,
        phoneNumber: true,
        email: true,
        imageUrl: true,
        faceToken: true,
      },
    });

    if (!voter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    return NextResponse.json(voter);
  } catch (error) {
    console.error("Error fetching voter:", error);
    return NextResponse.json(
      { error: "Failed to fetch voter details" },
      { status: 500 }
    );
  }
}
