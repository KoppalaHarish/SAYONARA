import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    let studentsToImport: any[] = [];

    // Case 1: Raw text input (CSV, TSV, or copy-pasted lines)
    if (body.rawText && typeof body.rawText === "string") {
      const lines = body.rawText.split("\n").map((l: string) => l.trim()).filter(Boolean);
      for (const line of lines) {
        // Support comma, tab, or dash separators
        const delimiter = line.includes("\t") ? "\t" : line.includes(",") ? "," : line.includes("-") ? "-" : null;
        let id = "";
        let name = "";
        let year = body.defaultYear || "4th Year";

        if (delimiter) {
          const parts = line.split(delimiter).map((p: string) => p.trim());
          // Check which part looks like an ID
          if (/\d/.test(parts[0]) && !/\d/.test(parts[1])) {
            id = parts[0];
            name = parts[1];
            if (parts[2]) year = parts[2].includes("3") ? "3rd Year" : "4th Year";
          } else {
            name = parts[0];
            id = parts[1];
            if (parts[2]) year = parts[2].includes("3") ? "3rd Year" : "4th Year";
          }
        } else {
          // Space separated e.g. "21CS001 John Doe"
          const parts = line.split(/\s+/);
          if (parts.length >= 2) {
            id = parts[0];
            name = parts.slice(1).join(" ");
          }
        }

        if (id && name) {
          studentsToImport.push({
            collegeId: id,
            name,
            year: year.includes("3") ? "3rd Year" : "4th Year",
            department: "CSE",
          });
        }
      }
    } else if (Array.isArray(body.students)) {
      studentsToImport = body.students;
    }

    if (studentsToImport.length === 0) {
      return NextResponse.json(
        { error: "No valid student entries found to import." },
        { status: 400 }
      );
    }

    const result = db.bulkImportStudents(studentsToImport);

    return NextResponse.json({
      message: `Successfully imported ${result.imported} students (${result.skipped} skipped/duplicates). Total CSE students: ${result.total}.`,
      result,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: "Failed to import student roster" }, { status: 500 });
  }
}
