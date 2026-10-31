import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only Head Admin can delete memories." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deleted = db.deleteGalleryItem(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Memory item not found or already removed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Memory item deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting memory item:", error);
    return NextResponse.json(
      { error: "Failed to delete memory item." },
      { status: 500 }
    );
  }
}
