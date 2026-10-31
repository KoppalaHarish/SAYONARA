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
        {
          error:
            "Restricted Action: Only Head Admin can remove coordinators. Faculty advisors and student leads do not possess modification rights.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deleted = db.deleteTeamMember(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Coordinator not found or already removed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coordinator removed from council successfully.",
    });
  } catch (error) {
    console.error("Error removing coordinator:", error);
    return NextResponse.json(
      { error: "Failed to remove coordinator." },
      { status: 500 }
    );
  }
}
