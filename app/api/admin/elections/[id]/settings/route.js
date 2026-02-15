import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, props) {
  const params = await props.params;
  try {
    const { id: electionId } = params;
    const { faceVerification, otpVerification, isLive } = await request.json();

    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: {
        faceVerification: Boolean(faceVerification),
        otpVerification: Boolean(otpVerification),
        isLive: Boolean(isLive),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        faceVerification: true,
        otpVerification: true,
        isLive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedElection);
  } catch (error) {
    console.error("Error updating election settings:", error);
    return NextResponse.json(
      { error: "Failed to update election settings" },
      { status: 500 }
    );
  }
}
