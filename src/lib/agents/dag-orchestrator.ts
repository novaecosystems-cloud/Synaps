export interface AgentTaskNode {
  id: string;
  name: string;
  description: string;
  dependencies: string[];
  run: (context: Record<string, any>) => Promise<any>;
}

export type TaskStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface TaskStatusEvent {
  nodeId: string;
  name: string;
  status: TaskStatus;
  result?: any;
  error?: string;
  timestamp: string;
}

/**
 * Directed Acyclic Graph (DAG) Multi-Agent Orchestrator
 * Runs independent agents in parallel and dependent agents sequentially.
 */
export class DAGOrchestrator {
  private nodes: Map<string, AgentTaskNode> = new Map();

  addNode(node: AgentTaskNode): this {
    this.nodes.set(node.id, node);
    return this;
  }

  getNode(id: string): AgentTaskNode | undefined {
    return this.nodes.get(id);
  }

  async execute(
    initialContext: Record<string, any> = {},
    onStatusChange?: (event: TaskStatusEvent) => void
  ): Promise<Record<string, any>> {
    const context = { ...initialContext };
    const completed = new Set<string>();
    const running = new Set<string>();
    const failed = new Set<string>();

    const canRun = (node: AgentTaskNode) =>
      !completed.has(node.id) &&
      !running.has(node.id) &&
      !failed.has(node.id) &&
      node.dependencies.every(dep => completed.has(dep));

    while (completed.size + failed.size < this.nodes.size) {
      const runnableNodes = Array.from(this.nodes.values()).filter(canRun);

      if (runnableNodes.length === 0 && running.size === 0) {
        const remaining = Array.from(this.nodes.keys()).filter(id => !completed.has(id));
        throw new Error(`DAG deadlock or cyclic dependency detected. Blocked tasks: ${remaining.join(', ')}`);
      }

      const executions = runnableNodes.map(async (node) => {
        running.add(node.id);
        if (onStatusChange) {
          onStatusChange({
            nodeId: node.id,
            name: node.name,
            status: 'active',
            timestamp: new Date().toISOString()
          });
        }

        try {
          console.log(`[DAG Orchestrator] Executing Agent Node: ${node.name} (${node.id})`);
          const result = await node.run(context);
          context[node.id] = result;
          completed.add(node.id);
          running.delete(node.id);

          if (onStatusChange) {
            onStatusChange({
              nodeId: node.id,
              name: node.name,
              status: 'completed',
              result,
              timestamp: new Date().toISOString()
            });
          }
        } catch (err: any) {
          running.delete(node.id);
          failed.add(node.id);
          const errorMsg = err.message || String(err);
          console.error(`[DAG Orchestrator] Agent Node '${node.id}' failed:`, errorMsg);

          if (onStatusChange) {
            onStatusChange({
              nodeId: node.id,
              name: node.name,
              status: 'failed',
              error: errorMsg,
              timestamp: new Date().toISOString()
            });
          }

          throw err;
        }
      });

      await Promise.all(executions);
    }

    return context;
  }
}
