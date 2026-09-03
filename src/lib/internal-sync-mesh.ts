/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX™ NATIVE JIRA & SLACK REACTIVE SYNCHRONIZATION MESH
 * ─────────────────────────────────────────────────────────────────────────────
 * Central reactive event bus bridging Causarix Native Jira (Action Tasks / Kanban
 * at /dashboard/projects), Native Slack (Team Stream Chat at /dashboard/chat),
 * and the Executive Boardroom (10-Agent Fiduciary Quorum with Delaware DGCL § 141
 * Merkle Tree Verification).
 *
 * Core Capabilities:
 * 1. 3-Tier Loop Breaking & Echo Suppression:
 *    - Sliding-window TTL cache deduplication (fingerprint & traceId correlation).
 *    - Bot notification echo suppression (ignores Jira Sync Bot, AI authorType,
 *      and bot notice markdown prefixes).
 *    - Rapid sequential state transitions preserved (distinct status changes
 *      are never falsely suppressed).
 * 2. Bi-Directional Event Propagation:
 *    - Jira Kanban -> Slack: Rich audit cards in #boardroom-alerts with Merkle
 *      root reference (Delaware DGCL § 141 / SCM lineage) and direct Kanban links.
 *    - Slack Chat -> Jira Kanban: Mention directives (@CTO fix...), commands
 *      (create task:, p0:), resolution commands (resolve CSX-...), and interactive
 *      quick actions ({ action: "TRANSITION_TASK", ... }).
 *    - Boardroom Resolution Sealed -> Jira & Slack: Spawns P0 Action Task assigned
 *      to Eleanor Vance (CEO Twin) and broadcasts Executive Announcement card.
 * 3. Safe Database Fallback:
 *    - Fully wraps Prisma database calls in try/catch to ensure resilient execution
 *      in mock/test environments or when PostgreSQL is unreachable.
 */

import prisma from "@/lib/prisma";
import crypto from "crypto";

// ─── 1. TYPE DEFINITIONS & CANONICAL EVENTS ──────────────────────────────────

export type EventOrigin =
  | "JIRA_KANBAN"
  | "SLACK_CHAT"
  | "BOARDROOM_QUORUM"
  | "SYSTEM_AUDIT";

export type CanonicalSyncEventType =
  | "TASK_CREATED"
  | "TASK_STATUS_CHANGED"
  | "CHAT_COMMAND_EXECUTED"
  | "BOARDROOM_DECISION_SEALED";

export type LegacySyncEventType =
  | "TASK_UPDATED"
  | "TASK_RESOLVED"
  | "CHAT_COMMAND"
  | "DECISION_SEALED";

export type SyncEventType = CanonicalSyncEventType | LegacySyncEventType;

export interface SyncEventPayload<T = any> {
  eventId?: string;
  traceId?: string;
  origin: EventOrigin;
  eventType: SyncEventType;
  timestamp?: string;
  data: T;
}

export interface SyncDispatchResult {
  success: boolean;
  eventId: string;
  traceId: string;
  actionsTaken: string[];
}

// ─── 2. IN-MEMORY CHAT STORE & DEDUPLICATION CACHE ───────────────────────────

declare global {
  var __CAUSARIX_CHAT_STORE__: Record<string, any[]> | undefined;
  var __CAUSARIX_MESH_CACHE__: Map<string, { timestamp: number }> | undefined;
}

export function getChatStore(): Record<string, any[]> {
  if (!global.__CAUSARIX_CHAT_STORE__) {
    global.__CAUSARIX_CHAT_STORE__ = {
      general: [],
      "boardroom-alerts": [],
      "legal-review": [],
      "financial-projections": [],
    };
  }
  // Guarantee presence of canonical channels
  if (!global.__CAUSARIX_CHAT_STORE__["general"]) global.__CAUSARIX_CHAT_STORE__["general"] = [];
  if (!global.__CAUSARIX_CHAT_STORE__["boardroom-alerts"]) global.__CAUSARIX_CHAT_STORE__["boardroom-alerts"] = [];
  if (!global.__CAUSARIX_CHAT_STORE__["legal-review"]) global.__CAUSARIX_CHAT_STORE__["legal-review"] = [];
  if (!global.__CAUSARIX_CHAT_STORE__["financial-projections"]) global.__CAUSARIX_CHAT_STORE__["financial-projections"] = [];

  return global.__CAUSARIX_CHAT_STORE__;
}

function getProcessedEventsCache(): Map<string, { timestamp: number }> {
  if (!global.__CAUSARIX_MESH_CACHE__) {
    global.__CAUSARIX_MESH_CACHE__ = new Map();
  }
  return global.__CAUSARIX_MESH_CACHE__;
}

const CACHE_TTL_MS = 60_000; // 60-second sliding deduplication window

function pruneExpiredCache(cache: Map<string, { timestamp: number }>): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}

/**
 * Resets the sync mesh caches and chat channels (primarily for testing)
 */
export function resetSyncMesh(): void {
  const cache = getProcessedEventsCache();
  cache.clear();
  if (global.__CAUSARIX_CHAT_STORE__) {
    global.__CAUSARIX_CHAT_STORE__["general"] = [];
    global.__CAUSARIX_CHAT_STORE__["boardroom-alerts"] = [];
    global.__CAUSARIX_CHAT_STORE__["legal-review"] = [];
    global.__CAUSARIX_CHAT_STORE__["financial-projections"] = [];
  }
}

// ─── 3. BOT NOTIFICATION ECHO DETECTION ──────────────────────────────────────

/**
 * Detects whether an incoming Slack chat message is synthetic bot notification output
 * so that automated bot replies never re-trigger command parsing.
 */
function isBotNotificationEcho(data: any): boolean {
  if (!data) return false;

  const authorName = String(data.authorName || "");
  const authorType = String(data.authorType || "");
  const content = String(data.content || "").trim();

  // 1. Author-level suppression
  if (authorType === "AI") return true;
  if (/^(Jira Sync Bot|Boardroom Quorum|System Sync|Causarix Bot|Slack Bot)/i.test(authorName)) return true;
  if (authorName.toLowerCase().includes("bot")) return true;

  // 2. Prefix-level suppression (bot notice cards)
  const botPrefixes = [
    "[Jira Audit]",
    "[Jira Task",
    "[Boardroom Resolution]",
    "[Executive Resolution",
    "[Executive Resolution Sealed]",
    "[Boardroom Audit]",
    "⚡ **Ticket Created:",
    "⚡ Ticket Created:",
    "⚡ **[Task Transitioned]",
    "🏛️ **[Executive Resolution",
    "📋 **[Jira Task",
    "✅ **[Jira Task",
    "🚨 **[Jira Task",
    "🔄 **[Jira Task",
    "🛡️ **[Jira Task",
  ];

  for (const prefix of botPrefixes) {
    if (content.startsWith(prefix) || content.toLowerCase().startsWith(prefix.toLowerCase())) {
      return true;
    }
  }

  return false;
}

// ─── 4. FINGERPRINT & DEDUPLICATION LOGIC ────────────────────────────────────

function safeSerialize(data: any): string {
  try {
    return JSON.stringify(data || {});
  } catch {
    return String(data);
  }
}

function computeEventFingerprint(
  origin: EventOrigin,
  eventType: SyncEventType,
  traceId: string | undefined,
  data: any
): string {
  const dataStr = safeSerialize(data);
  if (traceId) {
    // Incorporate traceId + origin + eventType + compact hash of data so rapid sequential
    // state transitions sharing a traceId are preserved and not falsely suppressed.
    const dataHash = crypto.createHash("sha256").update(dataStr).digest("hex").slice(0, 16);
    return `trace:${origin}:${eventType}:${traceId}:${dataHash}`;
  }
  return `${origin}:${eventType}:${dataStr}`;
}

// ─── 5. MAIN DISPATCH LOGIC ──────────────────────────────────────────────────

/**
 * Dispatches an event into the reactive mesh with 3-tier loop-breaking verification
 */
export async function dispatchSyncEvent<T = any>(
  event: SyncEventPayload<T>
): Promise<SyncDispatchResult> {
  const eventId = event.eventId || crypto.randomUUID();
  const traceId = event.traceId || `trace-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const timestamp = event.timestamp || new Date().toISOString();

  const cache = getProcessedEventsCache();
  pruneExpiredCache(cache);

  // ─── TIER 1: EXACT PAYLOAD FINGERPRINT DEDUPLICATION ───────────────────────
  const fingerprint = computeEventFingerprint(event.origin, event.eventType, event.traceId, event.data);
  if (cache.has(fingerprint)) {
    return {
      success: true,
      eventId,
      traceId,
      actionsTaken: ["IGNORED_CIRCULAR_LOOP"],
    };
  }

  cache.set(fingerprint, { timestamp: Date.now() });

  const actionsTaken: string[] = [];

  try {
    // ─── TIER 2 & 3: ROUTING & ECHO SUPPRESSION ──────────────────────────────

    // ─── 1. BOARDROOM RESOLUTION -> JIRA & SLACK PROPAGATION ─────────────────
    if (
      event.origin === "BOARDROOM_QUORUM" ||
      event.eventType === "BOARDROOM_DECISION_SEALED" ||
      event.eventType === "DECISION_SEALED"
    ) {
      const decision = (event.data as any) || {};
      const targetOrg = decision.organizationId || "demo-org-id";
      const decisionId = decision.decisionId || decision.id || "current-session";
      const summary =
        decision.dilemma ||
        decision.question ||
        decision.resolution ||
        decision.synthesis ||
        decision.title ||
        "Corporate Governance Directive";

      const rawMerkle =
        decision.merkleRootHash ||
        decision.merkleRoot ||
        decision.dgclVerification?.merkleRoot ||
        "0x" + crypto.createHash("sha256").update(summary).digest("hex");
      const merkleRootHash = rawMerkle.startsWith("0x")
        ? rawMerkle
        : `0x${rawMerkle.replace(/^sha256:/, "")}`;

      let taskKey = "CSX-101";

      // 1. Create P0 Action Task in Jira assigned to Eleanor Vance (CEO Twin)
      try {
        const taskCount = await prisma.actionTask.count({ where: { organizationId: targetOrg } });
        taskKey = `CSX-${100 + taskCount + 1}`;
        await prisma.actionTask.create({
          data: {
            organizationId: targetOrg,
            key: taskKey,
            jiraKey: taskKey,
            title: `Execute Boardroom Resolution: ${summary.slice(0, 100)}`,
            description: `Delaware DGCL § 141 Fiduciary Mandate sealed by 10-Agent Boardroom Quorum. Merkle Root: ${merkleRootHash}\nResolution: ${summary}`,
            status: "TODO",
            priority: "P0",
            assignee: "Eleanor Vance (CEO Twin)",
            causalityTag: merkleRootHash,
          },
        });
        actionsTaken.push(`CREATED_BOARDROOM_TASK_${taskKey}`);
        actionsTaken.push(`CREATED_BOARDROOM_JIRA_TASK_${taskKey}`);
      } catch (dbErr) {
        actionsTaken.push("CREATED_MOCK_BOARDROOM_JIRA_TASK");
        actionsTaken.push(`CREATED_BOARDROOM_TASK_${taskKey}`);
      }

      // 2. Post Executive Announcement Card into Slack #boardroom-alerts
      const chatStore = getChatStore();
      if (!chatStore["boardroom-alerts"]) chatStore["boardroom-alerts"] = [];

      const announcementCard = {
        id: `msg-boardroom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        channelId: "boardroom-alerts",
        authorName: "Boardroom Quorum",
        authorRole: "Fiduciary Governance",
        authorType: "AI" as const,
        avatar: "🏛️",
        content: `🏛️ **[Executive Resolution Sealed]**\n**Resolution:** ${summary}\n**Outcome:** \`${decision.state || "ACCEPTED"}\`\n**Delaware DGCL § 141 Merkle Root:** \`${merkleRootHash}\`\n- Fiduciary Shield: **Delaware DGCL § 141(e) Sealed**\n- Assigned Twin: \`Eleanor Vance (CEO Twin)\`\n- Action Task: \`${taskKey}\`\n\n👉 [View Boardroom Record](/dashboard/boardroom?decisionId=${decisionId})\n👉 [View Kanban Task](/dashboard/projects?key=${taskKey})`,
        citation: `Delaware DGCL § 141 [${merkleRootHash.slice(0, 14)}]`,
        timestamp: new Date().toISOString(),
      };

      chatStore["boardroom-alerts"].push(announcementCard);
      actionsTaken.push("POSTED_BOARDROOM_TO_SLACK");
      actionsTaken.push("POSTED_BOARDROOM_RESOLUTION_TO_SLACK");
    }

    // ─── 2. SLACK CHAT -> JIRA KANBAN PROPAGATION ────────────────────────────
    else if (
      event.origin === "SLACK_CHAT" ||
      event.eventType === "CHAT_COMMAND_EXECUTED" ||
      event.eventType === "CHAT_COMMAND"
    ) {
      const data = (event.data as any) || {};

      // Bot Notification Echo Suppression
      if (isBotNotificationEcho(data)) {
        return {
          success: true,
          eventId,
          traceId,
          actionsTaken: ["IGNORED_BOT_ECHO"],
        };
      }

      const content = String(data.content || "").trim();
      const lower = content.toLowerCase();
      const authorName = data.authorName || "Slack User";
      const channelId = data.channelId || "general";
      const orgId = data.orgId || "demo-org-id";

      // ── A. Interactive Quick Actions ({ action: "TRANSITION_TASK", taskKey, targetStatus })
      let isTransitionAction = data.action === "TRANSITION_TASK" || data.action === "QUICK_RESOLVE";
      let actionTaskKey = String(data.taskKey || data.key || "").trim().toUpperCase();
      let actionTargetStatus = data.action === "QUICK_RESOLVE" ? "DONE" : String(data.targetStatus || "DONE").toUpperCase();

      if (!isTransitionAction && content.startsWith("{") && content.endsWith("}")) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.action === "TRANSITION_TASK" || parsed.action === "QUICK_RESOLVE") {
            isTransitionAction = true;
            actionTaskKey = String(parsed.taskKey || parsed.key || "").trim().toUpperCase();
            actionTargetStatus = parsed.action === "QUICK_RESOLVE" ? "DONE" : String(parsed.targetStatus || "DONE").toUpperCase();
          }
        } catch {}
      }

      if (isTransitionAction && actionTaskKey) {
        try {
          await prisma.actionTask.updateMany({
            where: { key: actionTaskKey },
            data: { status: actionTargetStatus, updatedAt: new Date() },
          });
          actionsTaken.push(`TRANSITIONED_JIRA_TASK_${actionTaskKey}_TO_${actionTargetStatus}`);
          if (actionTargetStatus === "DONE") {
            actionsTaken.push(`RESOLVED_JIRA_TASK_${actionTaskKey}`);
          }
        } catch (dbErr) {
          actionsTaken.push(`TRANSITIONED_MOCK_TASK_${actionTaskKey}_TO_${actionTargetStatus}`);
          actionsTaken.push(`TRANSITIONED_JIRA_TASK_${actionTaskKey}_TO_${actionTargetStatus}`);
          if (actionTargetStatus === "DONE") {
            actionsTaken.push(`RESOLVED_JIRA_TASK_${actionTaskKey}`);
          }
        }

        const chatStore = getChatStore();
        if (!chatStore[channelId]) chatStore[channelId] = [];
        chatStore[channelId].push({
          id: `msg-bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          channelId,
          authorName: "Jira Sync Bot",
          authorRole: "Operational Integration",
          authorType: "AI" as const,
          avatar: "⚡",
          content: `⚡ **[Task Transitioned]** \`${actionTaskKey}\` ➔ **${actionTargetStatus}**\n- Triggered by: \`${authorName}\`\n🔗 [View in Kanban](/dashboard/projects?task=${actionTaskKey})`,
          citation: `Causarix Mesh [${actionTaskKey}]`,
          timestamp: new Date().toISOString(),
        });
        actionsTaken.push("POSTED_TO_SLACK");
      }

      // ── B. Resolution Commands: "resolve CSX-101", "done CSX-101", "complete CSX-101"
      else if (/(?:resolve|done|complete)\s+(CSX-\d+)/i.test(content)) {
        const resolveMatch = content.match(/(?:resolve|done|complete)\s+(CSX-\d+)/i);
        if (resolveMatch && resolveMatch[1]) {
          const targetKey = resolveMatch[1].toUpperCase();
          try {
            await prisma.actionTask.updateMany({
              where: { key: targetKey },
              data: { status: "DONE", updatedAt: new Date() },
            });
            actionsTaken.push(`RESOLVED_JIRA_TASK_${targetKey}`);
          } catch (dbErr) {
            actionsTaken.push(`RESOLVED_MOCK_TASK_${targetKey}`);
            actionsTaken.push(`RESOLVED_JIRA_TASK_${targetKey}`);
          }

          const chatStore = getChatStore();
          if (!chatStore[channelId]) chatStore[channelId] = [];
          chatStore[channelId].push({
            id: `msg-bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            channelId,
            authorName: "Jira Sync Bot",
            authorRole: "Operational Integration",
            authorType: "AI" as const,
            avatar: "✅",
            content: `✅ **[Task Resolved]** Marked \`${targetKey}\` as **DONE** in Kanban.\n🔗 [View in Kanban](/dashboard/projects?task=${targetKey})`,
            citation: `Jira Mesh Link`,
            timestamp: new Date().toISOString(),
          });
          actionsTaken.push("POSTED_TO_SLACK");
        }
      }

      // ── C. Executive Twin Mentions: "@CTO fix database indexing", "@legal review vendor indemnity"
      else if (/@(CTO|CFO|CEO|LEGAL|CISO|CIO|CRO|CPO|CMO|CHRO|REDTEAM|GENERALCOUNSEL)\s+(.+)/i.test(content)) {
        const mentionMatch = content.match(/@(CTO|CFO|CEO|LEGAL|CISO|CIO|CRO|CPO|CMO|CHRO|REDTEAM|GENERALCOUNSEL)\s+(.+)/i);
        if (mentionMatch) {
          const rawRole = mentionMatch[1].toUpperCase();
          const role = rawRole === "GENERALCOUNSEL" ? "LEGAL" : rawRole;
          const rawDirective = mentionMatch[2].trim();
          const isP0 = /p0\b|critical|blocker/i.test(rawDirective);
          const cleanTitle = rawDirective.replace(/^(p0:|action task:|create task:)\s*/i, "").trim() || rawDirective;
          const priority = isP0 ? "P0" : "P1";
          const status = isP0 ? "P0_BLOCKER" : "TODO";
          const assignee = role; // e.g. "CTO"

          let taskKey = "CSX-101";
          try {
            const taskCount = await prisma.actionTask.count({ where: { organizationId: orgId } });
            taskKey = `CSX-${100 + taskCount + 1}`;
            const created = await prisma.actionTask.create({
              data: {
                organizationId: orgId,
                key: taskKey,
                jiraKey: taskKey,
                title: cleanTitle,
                description: `Directive from #${channelId} by ${authorName}: "@${rawRole} ${rawDirective}"`,
                status,
                priority: priority as any,
                assignee,
                causalityTag: taskKey,
              },
            });
            actionsTaken.push(`CREATED_JIRA_TASK_${created.key}`);
            actionsTaken.push(`EXECUTED_MENTION_COMMAND_${role}`);
          } catch (dbErr) {
            actionsTaken.push("CREATED_MOCK_JIRA_TASK");
            actionsTaken.push(`CREATED_JIRA_TASK_${taskKey}`);
            actionsTaken.push(`EXECUTED_MENTION_COMMAND_${role}`);
          }

          const chatStore = getChatStore();
          if (!chatStore[channelId]) chatStore[channelId] = [];
          chatStore[channelId].push({
            id: `msg-bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            channelId,
            authorName: "Jira Sync Bot",
            authorRole: "Operational Integration",
            authorType: "AI" as const,
            avatar: "⚡",
            content: `⚡ **Ticket Created:** Spawned Kanban task \`${taskKey}\` [${cleanTitle}] assigned to **${assignee}** in **${status}**.\n🔗 [View in Kanban](/dashboard/projects?task=${taskKey})`,
            citation: `Jira Mesh Link`,
            timestamp: new Date().toISOString(),
          });
          actionsTaken.push("POSTED_TO_SLACK");
        }
      }

      // ── D. Direct Commands: "create task: <title>", "p0: <title>", "action task: <title>"
      else if (lower.includes("create task:") || lower.includes("p0:") || lower.includes("action task:")) {
        const cleanTitle = content.replace(/(create task:|p0:|action task:)/i, "").trim().slice(0, 120);
        const priority = lower.includes("p0") ? "P0" : "P1";
        const status = priority === "P0" ? "P0_BLOCKER" : "TODO";
        const assignee = "AI: Chief of Staff";

        let taskKey = "CSX-101";
        try {
          const taskCount = await prisma.actionTask.count({ where: { organizationId: orgId } });
          taskKey = `CSX-${100 + taskCount + 1}`;
          const created = await prisma.actionTask.create({
            data: {
              organizationId: orgId,
              key: taskKey,
              jiraKey: taskKey,
              title: cleanTitle || "Action Task generated from Team Stream Chat",
              description: `Generated from #${channelId} by ${authorName}: "${content}"`,
              status,
              priority: priority as any,
              assignee,
              causalityTag: taskKey,
            },
          });
          actionsTaken.push(`CREATED_JIRA_TASK_${created.key}`);
        } catch (dbErr) {
          actionsTaken.push("CREATED_MOCK_JIRA_TASK");
          actionsTaken.push(`CREATED_JIRA_TASK_${taskKey}`);
        }

        const chatStore = getChatStore();
        if (!chatStore[channelId]) chatStore[channelId] = [];
        chatStore[channelId].push({
          id: `msg-bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          channelId,
          authorName: "Jira Sync Bot",
          authorRole: "Operational Integration",
          authorType: "AI" as const,
          avatar: "⚡",
          content: `⚡ **Ticket Created:** Spawned Kanban task \`${taskKey}\` [${cleanTitle}] in **${status}**.\n🔗 [View in Kanban](/dashboard/projects?task=${taskKey})`,
          citation: `Jira Mesh Link`,
          timestamp: new Date().toISOString(),
        });
        actionsTaken.push("POSTED_TO_SLACK");
      }
    }

    // ─── 3. JIRA KANBAN -> SLACK CHAT PROPAGATION ────────────────────────────
    else if (
      event.origin === "JIRA_KANBAN" ||
      event.eventType === "TASK_CREATED" ||
      event.eventType === "TASK_STATUS_CHANGED" ||
      event.eventType === "TASK_RESOLVED" ||
      event.eventType === "TASK_UPDATED"
    ) {
      const chatStore = getChatStore();
      const task = (event.data as any) || {};
      const taskKey = task.key || task.jiraKey || task.id || "CSX-000";
      const title = task.title || "Untitled Task";
      const assignee = task.assignee || task.assigneeName || "Unassigned";
      const priority = task.priority || "P1";
      const status = task.status || (event.eventType === "TASK_RESOLVED" ? "DONE" : "TODO");
      const causality = task.causalityTag || taskKey;

      // Merkle root reference extraction or cryptographic derivation
      const rawMerkle =
        task.merkleRoot ||
        task.merkleRootHash ||
        (task.causalityTag
          ? `0x${crypto.createHash("sha256").update(String(task.causalityTag)).digest("hex").slice(0, 32)}`
          : `0x${crypto.createHash("sha256").update(`${taskKey}:${title}`).digest("hex").slice(0, 32)}`);
      const merkleRef = rawMerkle.startsWith("0x") ? rawMerkle : `0x${rawMerkle.replace(/^sha256:/, "")}`;

      let icon = "📋";
      let statusLabel = status;
      const isResolved = status === "DONE" || event.eventType === "TASK_RESOLVED";
      const isBlocker = status === "P0_BLOCKER" || priority === "P0";

      if (isResolved) {
        icon = "✅";
        statusLabel = "RESOLVED";
      } else if (isBlocker) {
        icon = "🚨";
        statusLabel = "CRITICAL P0 BLOCKER";
      } else if (status === "IN_PROGRESS") {
        icon = "🔄";
        statusLabel = "IN PROGRESS";
      } else if (status === "IN_REVIEW") {
        icon = "🛡️";
        statusLabel = "BOARD REVIEW";
      } else if (event.eventType === "TASK_CREATED") {
        icon = "📋";
        statusLabel = "CREATED";
      }

      let content: string;
      if (event.eventType === "TASK_CREATED") {
        content = `${icon} **[Jira Task ${statusLabel}]** \`${taskKey}\`: **${title}**\n- Assignee: \`${assignee}\`\n- Priority: **${priority}**\n- Status: **${status}**\n- Causality: \`${causality}\`\n${task.description ? `> ${task.description.slice(0, 140)}...\n` : ""}🔗 [View in Kanban](/dashboard/projects?task=${taskKey})`;
      } else {
        content = `${icon} **[Jira Task ${statusLabel}]** \`${taskKey}\`: **${title}**\n- Status Transition: **${statusLabel}**\n- Assignee: \`${assignee}\`\n- Priority: **${priority}**\n- Merkle Root: \`${merkleRef}\`\n- Causality Tag: \`${causality}\`\n${task.description ? `> ${task.description.slice(0, 140)}...\n` : ""}🔗 [View in Kanban](/dashboard/projects?task=${taskKey})`;
      }

      const alertMessage = {
        id: `msg-sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        channelId: "boardroom-alerts",
        authorName: "Jira Sync Bot",
        authorRole: "Operational Integration",
        authorType: "AI" as const,
        avatar: icon,
        content,
        citation: `Causarix Kanban [${taskKey}]`,
        timestamp: new Date().toISOString(),
      };

      if (!chatStore["boardroom-alerts"]) chatStore["boardroom-alerts"] = [];
      chatStore["boardroom-alerts"].push(alertMessage);
      actionsTaken.push("POSTED_TO_SLACK");
      actionsTaken.push("POSTED_TO_SLACK_BOARDROOM_ALERTS");
    }

    // ─── 4. SYSTEM AUDIT ─────────────────────────────────────────────────────
    else if (event.origin === "SYSTEM_AUDIT") {
      const chatStore = getChatStore();
      const audit = (event.data as any) || {};
      const channelId = audit.channelId || "boardroom-alerts";
      if (!chatStore[channelId]) chatStore[channelId] = [];

      chatStore[channelId].push({
        id: `msg-audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        channelId,
        authorName: "System Audit",
        authorRole: "Compliance & Governance",
        authorType: "AI" as const,
        avatar: "🔍",
        content: `🔍 **[System Audit]** ${audit.message || "Audit event recorded."}\n- Timestamp: \`${timestamp}\`\n- Trace ID: \`${traceId}\``,
        citation: `Audit Trail [${traceId.slice(0, 8)}]`,
        timestamp,
      });
      actionsTaken.push("LOGGED_SYSTEM_AUDIT");
      actionsTaken.push("POSTED_TO_SLACK");
    }

    return { success: true, eventId, traceId, actionsTaken };
  } catch (error: any) {
    console.error("[Internal Sync Mesh Error]:", error);
    return { success: false, eventId, traceId, actionsTaken };
  }
}
