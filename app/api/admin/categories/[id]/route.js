import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(req, props) {
  const params = await props.params;
  try {
    const { name, displayName, description } = await req.json();
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        displayName,
        description,
      },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    await prisma.candidate.deleteMany({
      where: { categoryId: params.id },
    });
    await prisma.category.delete({
      where: { id: params.id },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
