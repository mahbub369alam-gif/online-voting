import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const candidates = await prisma.candidate.findMany();
    return NextResponse.json(candidates);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const party = formData.get("party");
    const bio = formData.get("bio");
    const categoryId = formData.get("categoryId");
    const ballotNumber = formData.get("ballotNumber");
    const imageFile = formData.get("image");

    if (!name || !imageFile || !categoryId) {
      return NextResponse.json(
        { error: "Name, image and category are required" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadToCloudinary(buffer, "candidates");

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        party: party || "",
        bio,
        imageUrl: uploadResult.secure_url,
        categoryId,
        ballotNumber: ballotNumber ? parseInt(ballotNumber, 10) : null,
      },
    });
    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
