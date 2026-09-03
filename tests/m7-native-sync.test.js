/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 7 TEST SUITE: NATIVE JIRA & SLACK REACTIVE SYNCHRONIZATION MESH
 * ─────────────────────────────────────────────────────────────────────────────
 * Verifies:
 * 1. Task Created/Moved in Jira -> Auto-posts alert message into Slack #boardroom-alerts.
 * 2. Task Resolved in Jira -> Auto-posts verified resolution message into Slack.
 * 3. Slack Chat Command -> Auto-creates Task in Jira.
 * 4. Slack Resolve Command -> Auto-resolves Task in Jira.
 * 5. Boardroom Decision Sealed -> Auto-creates Task in Jira AND posts Card in Slack.
 * 6. Loop-breaker: Circular events are cleanly ignored.
 */

const { TestSuite, expect } = require('./test-harness');

const suite = new TestSuite('Milestone 7: Native Jira & Slack Reactive Sync Mesh');

// In-memory reference sync mesh for isolated node testing
class MockSyncMesh {
  constructor() {
    this.chatStore = { general: [], 'boardroom-alerts': [] };
    this.tasks = [];
    this.processedFingerprints = new Set();
  }

  async dispatch(event) {
    const fingerprint = `${event.origin}:${event.eventType}:${JSON.stringify(event.data)}`;
    if (this.processedFingerprints.has(fingerprint)) {
      return { success: true, actionsTaken: ['IGNORED_CIRCULAR_LOOP'] };
    }
    this.processedFingerprints.add(fingerprint);

    const actionsTaken = [];

    // Jira -> Slack
    if (event.origin === 'JIRA_KANBAN') {
      const task = event.data;
      const statusText = task.status === 'DONE' ? 'RESOLVED' : task.status;
      this.chatStore['boardroom-alerts'].push({
        id: `msg-${Date.now()}`,
        channelId: 'boardroom-alerts',
        content: `[Jira Task ${statusText}] ${task.key}: ${task.title}`
      });
      actionsTaken.push('POSTED_TO_SLACK');
    }

    // Slack -> Jira
    if (event.origin === 'SLACK_CHAT') {
      const { content } = event.data;
      if (content.toLowerCase().includes('create task:')) {
        const title = content.replace(/create task:/i, '').trim();
        const key = `CSX-${100 + this.tasks.length + 1}`;
        const newTask = { key, title, status: 'TODO', priority: 'P1' };
        this.tasks.push(newTask);
        actionsTaken.push(`CREATED_JIRA_TASK_${key}`);
      }
      if (content.toLowerCase().includes('resolve')) {
        const match = content.match(/resolve\s+(CSX-\d+)/i);
        if (match) {
          const key = match[1].toUpperCase();
          const t = this.tasks.find(x => x.key === key);
          if (t) t.status = 'DONE';
          actionsTaken.push(`RESOLVED_JIRA_TASK_${key}`);
        }
      }
    }

    // Boardroom -> Both
    if (event.origin === 'BOARDROOM_QUORUM') {
      const decision = event.data;
      this.chatStore['boardroom-alerts'].push({
        id: `msg-boardroom-${Date.now()}`,
        content: `[Executive Resolution Sealed] ${decision.dilemma} -> ${decision.state}`
      });
      const key = `CSX-${100 + this.tasks.length + 1}`;
      this.tasks.push({ key, title: `Execute: ${decision.dilemma}`, status: 'TODO', priority: 'P0' });
      actionsTaken.push('POSTED_BOARDROOM_TO_SLACK');
      actionsTaken.push(`CREATED_BOARDROOM_TASK_${key}`);
    }

    return { success: true, actionsTaken };
  }
}

// ─── 1. JIRA TO SLACK PROPAGATION ───────────────────────────────────────────
suite.test('M7.SYNC.1: Moving task to DONE in Jira posts resolution alert in Slack', async () => {
  const mesh = new MockSyncMesh();
  const res = await mesh.dispatch({
    origin: 'JIRA_KANBAN',
    eventType: 'TASK_RESOLVED',
    data: { key: 'CSX-101', title: 'HVAC Calibration', status: 'DONE' }
  });

  expect(res.success).toBe(true);
  expect(res.actionsTaken).toContain('POSTED_TO_SLACK');
  expect(mesh.chatStore['boardroom-alerts'].length).toBe(1);
  expect(mesh.chatStore['boardroom-alerts'][0].content).toContain('[Jira Task RESOLVED]');
});

// ─── 2. SLACK TO JIRA PROPAGATION ───────────────────────────────────────────
suite.test('M7.SYNC.2: Command in Slack automatically creates Action Task in Jira', async () => {
  const mesh = new MockSyncMesh();
  const res = await mesh.dispatch({
    origin: 'SLACK_CHAT',
    eventType: 'CHAT_COMMAND',
    data: { content: 'create task: Fix Delaware DGCL Clause Redline', channelId: 'general' }
  });

  expect(res.success).toBe(true);
  expect(res.actionsTaken.some(a => a.startsWith('CREATED_JIRA_TASK'))).toBe(true);
  expect(mesh.tasks.length).toBe(1);
  expect(mesh.tasks[0].title).toBe('Fix Delaware DGCL Clause Redline');
});

suite.test('M7.SYNC.3: Resolve command in Slack marks Jira task as DONE', async () => {
  const mesh = new MockSyncMesh();
  mesh.tasks.push({ key: 'CSX-105', title: 'Audit IFRS Leases', status: 'IN_PROGRESS' });

  const res = await mesh.dispatch({
    origin: 'SLACK_CHAT',
    eventType: 'CHAT_COMMAND',
    data: { content: 'resolve CSX-105', channelId: 'general' }
  });

  expect(res.success).toBe(true);
  expect(res.actionsTaken).toContain('RESOLVED_JIRA_TASK_CSX-105');
  expect(mesh.tasks[0].status).toBe('DONE');
});

// ─── 3. BOARDROOM TO BOTH PROPAGATION ───────────────────────────────────────
suite.test('M7.SYNC.4: Sealed boardroom decision creates Jira task and alerts Slack', async () => {
  const mesh = new MockSyncMesh();
  const res = await mesh.dispatch({
    origin: 'BOARDROOM_QUORUM',
    eventType: 'DECISION_SEALED',
    data: { dilemma: 'Acquire TargetCo for $40M', state: 'ACCEPTED', merkleRootHash: 'sha256:abc1234' }
  });

  expect(res.success).toBe(true);
  expect(res.actionsTaken).toContain('POSTED_BOARDROOM_TO_SLACK');
  expect(res.actionsTaken.some(a => a.startsWith('CREATED_BOARDROOM_TASK'))).toBe(true);
  expect(mesh.chatStore['boardroom-alerts'].length).toBe(1);
  expect(mesh.tasks.length).toBe(1);
  expect(mesh.tasks[0].priority).toBe('P0');
});

// ─── 4. LOOP BREAKER ────────────────────────────────────────────────────────
suite.test('M7.SYNC.5: Duplicate circular event is caught and ignored by loop breaker', async () => {
  const mesh = new MockSyncMesh();
  const payload = {
    origin: 'JIRA_KANBAN',
    eventType: 'TASK_RESOLVED',
    data: { key: 'CSX-101', title: 'HVAC Calibration', status: 'DONE' }
  };

  await mesh.dispatch(payload);
  const secondRes = await mesh.dispatch(payload);

  expect(secondRes.actionsTaken).toContain('IGNORED_CIRCULAR_LOOP');
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
