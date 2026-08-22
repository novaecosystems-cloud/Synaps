import { NextRequest, NextResponse } from "next/server";
import { listVirtualFiles, getVirtualFile, writeVirtualFile, deleteVirtualFile } from "@/lib/agent-sandbox-computer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (path) {
      const file = getVirtualFile(path);
      if (!file) {
        return NextResponse.json({ success: false, error: "File not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, file });
    }

    const files = listVirtualFiles();
    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to read files." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, content, author } = body;

    if (!path || content === undefined) {
      return NextResponse.json({ success: false, error: "Path and content are required." }, { status: 400 });
    }

    const file = writeVirtualFile(path, content, author || "@User");
    return NextResponse.json({ success: true, file });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to write file." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ success: false, error: "Path is required." }, { status: 400 });
    }

    const deleted = deleteVirtualFile(path);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete file." }, { status: 500 });
  }
}
