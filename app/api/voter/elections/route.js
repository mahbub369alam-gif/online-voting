import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const elections = await prisma.votingSchedule.findMany({
      where: {
        status: "active",
      },
    });
    return NextResponse.json(elections);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}
