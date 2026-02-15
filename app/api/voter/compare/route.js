import { compareFaces } from "@/lib/actions/face-actions";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.formData();
    const capturedImage = data.get("capturedImage");
    const voterId = data.get("voterId");

    const result = await compareFaces(voterId, capturedImage);

    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
