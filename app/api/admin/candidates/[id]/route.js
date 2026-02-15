import prisma from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
    });
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(candidate);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const id = (await params).id;
    const formData = await req.formData();
    const name = formData.get("name");
    const party = formData.get("party");
    const bio = formData.get("bio");
    const categoryId = formData.get("categoryId");
    const ballotNumber = formData.get("ballotNumber");
    const imageFile = formData.get("image");

    // Get existing candidate
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    let imageUrl = existingCandidate.imageUrl;

    // If new image is uploaded, delete old and upload new
    if (imageFile && imageFile.size > 0) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(existingCandidate.imageUrl);

      // Upload new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "candidates");
      imageUrl = uploadResult.secure_url;
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        name,
        party,
        bio,
        imageUrl,
        categoryId,
        ballotNumber: ballotNumber ? parseInt(ballotNumber, 10) : null,
      },
    });
    return NextResponse.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    // Get candidate to delete image
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
    });

    if (candidate) {
      // Delete image from Cloudinary
      await deleteFromCloudinary(candidate.imageUrl);
    }

    await prisma.candidate.delete({
      where: { id: params.id },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
