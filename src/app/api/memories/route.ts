import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const memories = db.getGallery();
    return NextResponse.json({
      success: true,
      memories,
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve memories." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only Head Admin can add memories, photos, and videos." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, category, year, imageUrl, mediaType, videoUrl, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Memory title is required." },
        { status: 400 }
      );
    }

    const isVideo = mediaType === "video";
    const finalImageUrl = imageUrl?.trim() || (isVideo 
      ? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" 
      : "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80");

    const newMemory: GalleryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      category: category?.trim() || "Farewell Memories",
      year: year?.trim() || "2021-2027",
      imageUrl: finalImageUrl,
      mediaType: isVideo ? "video" : "photo",
      videoUrl: isVideo ? (videoUrl?.trim() || "") : undefined,
      description: description?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const saved = db.addGalleryItem(newMemory);

    return NextResponse.json(
      {
        success: true,
        message: "Memory successfully uploaded to the vault!",
        memory: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding memory:", error);
    return NextResponse.json(
      { error: "Internal server error while saving memory." },
      { status: 500 }
    );
  }
}
