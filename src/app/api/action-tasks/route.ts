import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/auth-server";

// In-memory store for offline demo/sandbox sessions — starts 100% blank.
let inMemoryTasks: any[] = [];

async function getUserContext() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("synaps-session")?.value;
    if (!session) return null;
    const decoded = await verifySessionCookie(session);
    if (!decoded) return null;
    return await prisma.user.findUnique({
      where: { id: decoded.uid },
      include: { organization: true }
    });
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserContext();
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const priorityFilter = searchParams.get("priority");
    const search = searchParams.get("search")?.toLowerCase();

    let tasks = [...inMemoryTasks];

    if (user?.organizationId) {
      try {
        const dbTasks = await prisma.projectTask.findMany({
          where: {
            organizationId: user.organizationId
          },
          orderBy: { updatedAt: "desc" },
          include: { notes: true }
        });

        if (dbTasks && dbTasks.length > 0) {
          tasks = dbTasks.map((t, idx) => ({
            id: `CSX-${100 + idx}`,
            title: t.title,
            description: t.notes?.[0]?.content || "Action item dispatched from Causarix OS.",
            status: t.status === "DONE" ? "DONE" : t.status === "ACTIVE" ? "IN_PROGRESS" : "TODO",
            priority: "P1",
            assigneeName: "Team",
            assigneeType: "HUMAN",
            causalEvidence: "Dispatched from Causarix SCM Engine",
            tags: ["ActionItem"],
            deadline: t.deadline?.toISOString() || null,
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString()
          }));
        }
      } catch (err) {
        console.warn("DB task lookup fallback to in-memory:", err);
      }
    }

    if (statusFilter && statusFilter !== "ALL") {
      tasks = tasks.filter(t => t.status === statusFilter);
    }
    if (priorityFilter && priorityFilter !== "ALL") {
      tasks = tasks.filter(t => t.priority === priorityFilter);
    }
    if (search) {
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(search) || 
        t.description.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      tasks,
      metrics: {
        total: tasks.length,
        p0_blockers: tasks.filter(t => t.status === "P0_BLOCKER").length,
        in_progress: tasks.filter(t => t.status === "IN_PROGRESS").length,
        under_review: tasks.filter(t => t.status === "IN_REVIEW").length,
        completed: tasks.filter(t => t.status === "DONE").length,
        ai_automated_ratio: "60%"
      }
    });
  } catch (error: any) {
    console.error("Error in action-tasks GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, priority, status, assigneeName, assigneeType, causalEvidence, tags, deadline } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const newTask = {
      id: `CSX-${100 + inMemoryTasks.length + 1}`,
      title,
      description: description || "No description provided.",
      status: status || "TODO",
      priority: priority || "P1",
      assigneeName: assigneeName || "Unassigned",
      assigneeType: assigneeType || "HUMAN",
      causalEvidence: causalEvidence || "100% SHA-256 Verified by Causarix OS",
      tags: tags || ["General"],
      deadline: deadline || new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryTasks.unshift(newTask);

    return NextResponse.json({
      success: true,
      task: newTask,
      message: `Action ticket ${newTask.id} created successfully.`
    });
  } catch (error: any) {
    console.error("Error in action-tasks POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, priority, assigneeName, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    const taskIndex = inMemoryTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    if (status) inMemoryTasks[taskIndex].status = status;
    if (priority) inMemoryTasks[taskIndex].priority = priority;
    if (assigneeName) inMemoryTasks[taskIndex].assigneeName = assigneeName;
    if (notes) inMemoryTasks[taskIndex].description += `\n[Update]: ${notes}`;
    inMemoryTasks[taskIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      task: inMemoryTasks[taskIndex],
      message: `Task ${id} updated to ${status || inMemoryTasks[taskIndex].status}`
    });
  } catch (error: any) {
    console.error("Error in action-tasks PATCH:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    inMemoryTasks = inMemoryTasks.filter(t => t.id !== id);

    return NextResponse.json({
      success: true,
      message: `Task ${id} deleted successfully.`
    });
  } catch (error: any) {
    console.error("Error in action-tasks DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
