import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { faceVerification, otpVerification } = body;

    if (faceVerification === undefined && otpVerification === undefined) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const election = await prisma.election.findUnique({
      where: { id },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    const updateStatus = await prisma.election.update({
      where: { id },
      data: {
        faceVerification:
          faceVerification === undefined
            ? election.faceVerification
            : faceVerification,
        otpVerification:
          otpVerification === undefined
            ? election.otpVerification
            : otpVerification,
      },
    });

    return NextResponse.json(updateStatus);
  } catch (error) {
    console.error("Error fetching election:", error);
    return NextResponse.json(
      { error: "Failed to fetch election" },
      { status: 500 }
    );
  }
}
