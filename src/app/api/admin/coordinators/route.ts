import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { TeamMember } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const team = db.getTeam();
    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Error fetching coordinators:", error);
    return NextResponse.json(
      { error: "Failed to retrieve organizing council." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Restricted Action: Only Head Admin (CSE-ADMIN) is authorized to add coordinators. Faculty advisors and student leads do not possess modification rights.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, role, category, department, contact } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Coordinator name and role are required." },
        { status: 400 }
      );
    }

    const newCoordinator: TeamMember = {
      id: `team_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      role: role.trim(),
      category: category || "Student Lead",
      department: department?.trim() || "CSE",
      contact: contact?.trim() || "",
      addedBy: session.collegeId,
      createdAt: new Date().toISOString(),
    };

    const saved = db.addTeamMember(newCoordinator);

    return NextResponse.json(
      {
        success: true,
        message: `Coordinator "${saved.name}" added to Organizing Council.`,
        member: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding coordinator:", error);
    return NextResponse.json(
      { error: "Failed to add coordinator to database." },
      { status: 500 }
    );
  }
}
