import { invokeLLMWithFallback } from '@/lib/llm-router';

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<any>;
}

export interface AgentStep {
  thought: string;
  action?: string;
  actionInput?: any;
  observation?: any;
}

/**
 * ReAct (Reasoning + Acting) Agent Engine
 * Built from scratch with zero external framework dependencies.
 * Follows the Think -> Act -> Observe -> Reflect pattern.
 */
export class ReActAgent {
  constructor(
    public readonly name: string,
    public readonly systemPrompt: string,
    private readonly tools: Map<string, AgentTool> = new Map(),
    private readonly maxSteps: number = 6
  ) {}

  registerTool(tool: AgentTool) {
    this.tools.set(tool.name, tool);
  }

  async run(goal: string, onStep?: (step: AgentStep) => void): Promise<string> {
    const steps: AgentStep[] = [];
    const toolList = Array.from(this.tools.values())
      .map(t => `- ${t.name}: ${t.description} | Arguments Schema: ${JSON.stringify(t.parameters)}`)
      .join('\n');

    const promptHeader = `${this.systemPrompt}

You operate in a ReAct loop (Reasoning and Acting).
Available Tools:
${toolList.length > 0 ? toolList : 'None'}

Goal: ${goal}

Instruction:
For each step, output your thought process starting with "Thought:".
If you need to use a tool, output:
Action: <tool_name>
Action Input: <valid_json_object>

If you have sufficient information to answer the goal, output your final answer after "Thought:" without any Action.`;

    for (let stepIdx = 0; stepIdx < this.maxSteps; stepIdx++) {
      const messages = [
        { role: 'system', content: promptHeader },
        ...steps.flatMap(s => [
          {
            role: 'assistant',
            content: `Thought: ${s.thought}${
              s.action ? `\nAction: ${s.action}\nAction Input: ${JSON.stringify(s.actionInput)}` : ''
            }`
          },
          ...(s.observation !== undefined
            ? [{ role: 'user', content: `Observation: ${JSON.stringify(s.observation)}` }]
            : [])
        ])
      ];

      const response = await invokeLLMWithFallback(messages);

      const actionMatch = response.match(/Action:\s*([^\n]+)/);
      const inputMatch = response.match(/Action Input:\s*({[\s\S]*?})/);
      const thoughtMatch = response.match(/Thought:\s*([\s\S]*?)(?=Action:|$)/i);

      const thought = thoughtMatch ? thoughtMatch[1].trim() : response;

      if (!actionMatch) {
        // Final Answer
        const finalAnswer = thought.replace(/^Thought:\s*/i, '').trim();
        if (onStep) onStep({ thought: finalAnswer });
        return finalAnswer;
      }

      const action = actionMatch[1].trim();
      let actionInput: any = {};
      try {
        if (inputMatch) {
          actionInput = JSON.parse(inputMatch[1].trim());
        }
      } catch (e) {
        console.warn(`[ReAct Agent: ${this.name}] Failed to parse Action Input JSON:`, e);
      }

      const tool = this.tools.get(action);
      let observation: any;

      if (tool) {
        try {
          console.log(`[ReAct Agent: ${this.name}] Executing Tool '${action}' with args:`, actionInput);
          observation = await tool.execute(actionInput);
        } catch (err: any) {
          console.error(`[ReAct Agent: ${this.name}] Tool '${action}' execution error:`, err);
          observation = { error: err.message || String(err) };
        }
      } else {
        observation = { error: `Tool '${action}' is not registered.` };
      }

      const currentStep: AgentStep = { thought, action, actionInput, observation };
      steps.push(currentStep);
      if (onStep) onStep(currentStep);
    }

    return steps.length > 0 ? steps[steps.length - 1].thought : 'Completed maximum execution steps.';
  }
}
