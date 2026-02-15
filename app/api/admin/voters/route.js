import { uploadToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Determine the "current" election context for voting status.
    // We treat the active election (isActive=true) as the context for "Voted/Not Voted".
    const activeElection = await prisma.election.findFirst({
      where: { isActive: true },
      select: { id: true },
    });

    const voters = await prisma.voter.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            votes: activeElection
              ? { where: { electionId: activeElection.id } }
              : true,
          },
        },
      },
    });

    const votersWithStatus = voters.map((v) => ({
      ...v,
      hasVoted: activeElection ? (v?._count?.votes || 0) > 0 : false,
    }));

    return NextResponse.json(votersWithStatus);
  } catch (error) {
    console.error("Error fetching voters:", error);
    return NextResponse.json(
      { error: "Failed to fetch voters" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const voterId = formData.get("voterId");
    const email = formData.get("email");
    const nidNumber = formData.get("nidNumber");
    const phoneNumber = formData.get("phoneNumber");
    const imageFile = formData.get("image");

    if (!voterId) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    let uploadResult;
    let faceToken;

    if (imageFile) {
      const file = imageFile;

      const formData = new FormData();
      formData.append("api_key", process.env.FACE_API_KEY);
      formData.append("api_secret", process.env.FACE_API_SECRET);
      formData.append("image_file", file);

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

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      uploadResult = await uploadToCloudinary(buffer, "voters");
    }

    const newVoter = await prisma.voter.create({
      data: {
        name,
        email,
        imageUrl: uploadResult?.secure_url || "",
        faceToken,
        nidNumber,
        phoneNumber,
        voterId,
      },
    });
    return NextResponse.json(newVoter, { status: 201 });
  } catch (error) {
    console.error("Error creating voter:", error);
    return NextResponse.json(
      { error: "Failed to create voter" },
      { status: 500 }
    );
  }
}
