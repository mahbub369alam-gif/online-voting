import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const voter = await prisma.voter.findUnique({
      where: { id: params.id },
    });
    if (!voter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }
    return NextResponse.json(voter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch voter" },
      { status: 500 }
    );
  }
}

export async function PUT(req, props) {
  const params = await props.params;
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const voterId = formData.get("voterId");
    const email = formData.get("email");
    const nidNumber = formData.get("nidNumber");
    const phoneNumber = formData.get("phoneNumber");
    const imageFile = formData.get("image");

    // Get existing voter
    const existingVoter = await prisma.voter.findUnique({
      where: { id: params.id },
    });

    if (!existingVoter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    let imageUrl = existingVoter.imageUrl;
    let faceToken = existingVoter.faceToken;

    // If new image is uploaded, delete old and upload new
    if (imageFile && imageFile.size > 0) {
      const formData = new FormData();
      formData.append("api_key", process.env.FACE_API_KEY);
      formData.append("api_secret", process.env.FACE_API_SECRET);
      formData.append("image_file", imageFile);

      const response = await fetch(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data?.face_num === 0) {
        return NextResponse.json(
          { error: "No face detected. use single face photo." },
          { status: 400 }
        );
      }

      if (data?.faces?.length > 1) {
        return NextResponse.json(
          { error: "Multiple face detected. use single face photo." },
          { status: 400 }
        );
      }

      faceToken = data.faces?.[0]?.face_token;

      if (data.error_message) {
        return NextResponse.json(
          { error: "Failed to detect face" },
          { status: 400 }
        );
      }

      // Delete old image from Cloudinary
      await deleteFromCloudinary(existingVoter.imageUrl);

      // Upload new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "voters");
      imageUrl = uploadResult.secure_url;
    }

    const updatedVoter = await prisma.voter.update({
      where: { id: params.id },
      data: {
        name,
        email,
        imageUrl,
        faceToken,
        nidNumber,
        phoneNumber,
        voterId,
      },
    });
    return NextResponse.json(updatedVoter);
  } catch (error) {
    console.error("Error updating voter:", error);
    return NextResponse.json(
      { error: "Failed to update voter" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    // Get voter to delete image
    const voter = await prisma.voter.findUnique({
      where: { id: params.id },
    });

    if (voter) {
      // Delete image from Cloudinary
      await deleteFromCloudinary(voter.imageUrl);
    }

    // Delete related vote and voter with prisma transaction
    const transaction = await prisma.$transaction([
      prisma.voterOtp.deleteMany({
        where: { voterId: params.id },
      }),
      prisma.vote.deleteMany({
        where: { voterId: params.id },
      }),
      prisma.voter.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Error deleting voter:", error);
    return NextResponse.json(
      { error: "Failed to delete voter" },
      { status: 500 }
    );
  }
}
