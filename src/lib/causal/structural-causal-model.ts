/**
 * CAUSARIX STRUCTURAL CAUSAL MODEL (SCM) & PEARL'S DO-CALCULUS ENGINE
 * 
 * Formal implementation of Judea Pearl's Causal Hierarchy (Association -> Intervention -> Counterfactuals).
 * Provides:
 * 1. Directed Acyclic Graph (DAG) validation & topological sorting (Kahn's algorithm).
 * 2. Graph Surgery (mutilated DAG creation G_{\overline{X}} removing incoming edges for do(X=x)).
 * 3. Back-Door Criterion solver: finds d-separated adjustment sets Z satisfying (Y \perp X | Z)_{G_{\underline{X}}}.
 * 4. 3-Step Counterfactual Engine:
 *    - Step 1 (Abduction): Estimate exogenous background noise U given factual observations (X=x, Y=y).
 *    - Step 2 (Action): Apply graph surgery G_{\overline{X}} with counterfactual intervention X=x'.
 *    - Step 3 (Prediction): Compute deterministic counterfactual outcome Y_{x'} over mutilated structural equations.
 */

export interface CausalNode {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  domain: 'finance' | 'legal' | 'tech' | 'infrastructure' | 'macro' | 'workforce';
  baselineValue: number;
  minVal?: number;
  maxVal?: number;
}

export interface CausalEdge {
  from: string; // Parent node ID
  to: string;   // Child node ID
  weight: number; // Structural coefficient / elasticity
  mechanismType: 'linear' | 'elastic' | 'threshold' | 'diminishing';
  description?: string;
}

export type StructuralEquation = (
  parents: Record<string, number>,
  exogenousNoise: number
) => number;

export interface CounterfactualQuery {
  targetNodeId: string;           // Y
  interventionNodeId: string;     // X
  interventionValue: number;      // x'
  observedEvidence: Record<string, number>; // Factual observations (X=x, Y=y, Z=z)
}

export interface CounterfactualResult {
  targetNodeId: string;
  factualValue: number;
  counterfactualValue: number;
  causalDelta: number;
  percentChange: number;
  intervenedGraphMutilation: string[];
  backdoorAdjustmentSet: string[];
  abducedNoise: Record<string, number>;
  formalDoCalculusFormula: string;
  confidenceInterval: [number, number];
  computationTimeMs: number;
}

export class StructuralCausalModel {
  public nodes: Map<string, CausalNode> = new Map();
  public edges: CausalEdge[] = [];
  public structuralEquations: Map<string, StructuralEquation> = new Map();
  public exogenousNoiseStdDev: Map<string, number> = new Map();

  constructor(public modelName: string, public description?: string) {}

  /**
   * Add a variable node to the SCM
   */
  public addNode(node: CausalNode, noiseStdDev: number = 0.05): this {
    this.nodes.set(node.id, node);
    this.exogenousNoiseStdDev.set(node.id, noiseStdDev);
    return this;
  }

  /**
   * Add a causal edge with structural weight
   */
  public addEdge(edge: CausalEdge): this {
    this.edges.push(edge);
    return this;
  }

  /**
   * Set a custom structural equation for a node: Y = f(PA_Y, U_Y)
   */
  public setEquation(nodeId: string, equation: StructuralEquation): this {
    this.structuralEquations.set(nodeId, equation);
    return this;
  }

  /**
   * Get parents of a given node in the DAG: PA(X)
   */
  public getParents(nodeId: string): string[] {
    return this.edges.filter(e => e.to === nodeId).map(e => e.from);
  }

  /**
   * Get children of a given node in the DAG: CH(X)
   */
  public getChildren(nodeId: string): string[] {
    return this.edges.filter(e => e.from === nodeId).map(e => e.to);
  }

  /**
   * Topological sorting using Kahn's algorithm to ensure DAG validity
   */
  public getTopologicalOrder(): string[] {
    const inDegree = new Map<string, number>();
    for (const [id] of this.nodes) {
      inDegree.set(id, 0);
    }
    for (const edge of this.edges) {
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    const queue: string[] = [];
    for (const [id, deg] of inDegree.entries()) {
      if (deg === 0) queue.push(id);
    }

    const order: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      order.push(current);

      for (const child of this.getChildren(current)) {
        inDegree.set(child, inDegree.get(child)! - 1);
        if (inDegree.get(child) === 0) {
          queue.push(child);
        }
      }
    }

    if (order.length !== this.nodes.size) {
      throw new Error(`[SCM DAG Error] Causal graph contains cyclic dependencies. Found ${order.length} of ${this.nodes.size} nodes.`);
    }

    return order;
  }

  /**
   * Default structural equation evaluator if not customized
   */
  private evaluateDefaultMechanism(nodeId: string, parentVals: Record<string, number>, noise: number): number {
    const node = this.nodes.get(nodeId);
    if (!node) return 0;

    const parents = this.getParents(nodeId);
    if (parents.length === 0) {
      return node.baselineValue + noise;
    }

    let calculated = node.baselineValue;
    for (const parentId of parents) {
      const edge = this.edges.find(e => e.from === parentId && e.to === nodeId);
      if (!edge) continue;

      const pVal = parentVals[parentId] ?? this.nodes.get(parentId)?.baselineValue ?? 0;
      const pBase = this.nodes.get(parentId)?.baselineValue ?? 1;
      const normalizedDelta = (pVal - pBase) / (pBase === 0 ? 1 : Math.abs(pBase));

      if (edge.mechanismType === 'linear') {
        calculated += edge.weight * normalizedDelta * Math.abs(node.baselineValue || 1);
      } else if (edge.mechanismType === 'elastic') {
        calculated *= (1 + (edge.weight * normalizedDelta));
      } else if (edge.mechanismType === 'diminishing') {
        calculated += edge.weight * Math.sign(normalizedDelta) * Math.log1p(Math.abs(normalizedDelta)) * Math.abs(node.baselineValue || 1);
      } else if (edge.mechanismType === 'threshold') {
        if (Math.abs(normalizedDelta) > 0.2) {
          calculated += edge.weight * normalizedDelta * Math.abs(node.baselineValue || 1) * 1.5;
        }
      }
    }

    return calculated + noise;
  }

  /**
   * Evaluates the factual state of the graph given a set of exogenous noise terms
   */
  public evaluateFactual(noiseMap: Record<string, number> = {}): Record<string, number> {
    const order = this.getTopologicalOrder();
    const values: Record<string, number> = {};

    for (const nodeId of order) {
      const parentVals: Record<string, number> = {};
      for (const p of this.getParents(nodeId)) {
        parentVals[p] = values[p];
      }

      const noise = noiseMap[nodeId] ?? 0;
      const customEq = this.structuralEquations.get(nodeId);
      if (customEq) {
        values[nodeId] = customEq(parentVals, noise);
      } else {
        values[nodeId] = this.evaluateDefaultMechanism(nodeId, parentVals, noise);
      }
    }

    return values;
  }

  /**
   * PEARL'S BACK-DOOR CRITERION SOLVER
   * Identifies an adjustment set Z that blocks all spurious back-door paths between X and Y.
   * Condition 1: No node in Z is a descendant of X.
   * Condition 2: Z blocks every back-door path between X and Y.
   */
  public findBackdoorAdjustmentSet(interventionNodeId: string, targetNodeId: string): string[] {
    const descendants = new Set<string>();
    const getDesc = (curr: string) => {
      for (const child of this.getChildren(curr)) {
        if (!descendants.has(child)) {
          descendants.add(child);
          getDesc(child);
        }
      }
    };
    getDesc(interventionNodeId);

    // Parents of intervention node that are not descendants of X are valid back-door adjustment candidates
    const adjustmentSet: string[] = [];
    for (const parent of this.getParents(interventionNodeId)) {
      if (!descendants.has(parent) && parent !== targetNodeId) {
        adjustmentSet.push(parent);
      }
    }

    return adjustmentSet;
  }

  /**
   * PEARL'S 3-STEP COUNTERFACTUAL INFERENCE ENGINE:
   * Query: P(Y_{X=x'} | X=x, Y=y)
   */
  public computeCounterfactual(query: CounterfactualQuery): CounterfactualResult {
    const startTime = performance.now();
    const { targetNodeId, interventionNodeId, interventionValue, observedEvidence } = query;

    const order = this.getTopologicalOrder();
    const factualValues = this.evaluateFactual();
    const factualTargetVal = observedEvidence[targetNodeId] ?? factualValues[targetNodeId] ?? 0;

    // STEP 1: ABDUCTION (Estimate exogenous background variables U given evidence)
    const abducedNoise: Record<string, number> = {};
    for (const nodeId of order) {
      if (observedEvidence[nodeId] !== undefined) {
        const expectedVal = factualValues[nodeId] ?? 0;
        abducedNoise[nodeId] = observedEvidence[nodeId] - expectedVal;
      } else {
        abducedNoise[nodeId] = 0;
      }
    }

    // STEP 2: ACTION / GRAPH SURGERY (Mutilate DAG: remove incoming edges to X, set X = x')
    const mutilatedIncomingEdges = this.edges
      .filter(e => e.to === interventionNodeId)
      .map(e => `${e.from} -> ${e.to}`);

    // STEP 3: PREDICTION (Compute counterfactual outcome over mutilated graph G_{\overline{X}})
    const counterfactualValues: Record<string, number> = {};
    for (const nodeId of order) {
      if (nodeId === interventionNodeId) {
        // Enforce hard intervention: do(X = x')
        counterfactualValues[nodeId] = interventionValue;
      } else {
        const parentVals: Record<string, number> = {};
        for (const p of this.getParents(nodeId)) {
          parentVals[p] = counterfactualValues[p];
        }

        const noise = abducedNoise[nodeId] ?? 0;
        const customEq = this.structuralEquations.get(nodeId);
        if (customEq) {
          counterfactualValues[nodeId] = customEq(parentVals, noise);
        } else {
          counterfactualValues[nodeId] = this.evaluateDefaultMechanism(nodeId, parentVals, noise);
        }
      }
    }

    const counterfactualTargetVal = counterfactualValues[targetNodeId];
    const causalDelta = counterfactualTargetVal - factualTargetVal;
    const percentChange = factualTargetVal === 0 ? 0 : (causalDelta / Math.abs(factualTargetVal)) * 100;

    // Back-door criterion adjustment set
    const backdoorSet = this.findBackdoorAdjustmentSet(interventionNodeId, targetNodeId);

    // Formal Mathematical Notation
    const zStr = backdoorSet.length > 0 ? ` \\mid ${backdoorSet.join(', ')}` : '';
    const formalDoFormula = `P(${targetNodeId}_{${interventionNodeId}=${interventionValue}} \\mid \\mathbf{e}) = \\sum_{\\mathbf{z}} P(${targetNodeId} \\mid do(${interventionNodeId}=${interventionValue}), \\mathbf{z}) P(\\mathbf{z}${zStr})`;

    const stdErr = (this.exogenousNoiseStdDev.get(targetNodeId) || 0.05) * Math.abs(counterfactualTargetVal);
    const ci: [number, number] = [
      counterfactualTargetVal - (1.96 * stdErr),
      counterfactualTargetVal + (1.96 * stdErr)
    ];

    const elapsed = performance.now() - startTime;

    return {
      targetNodeId,
      factualValue: parseFloat(factualTargetVal.toFixed(2)),
      counterfactualValue: parseFloat(counterfactualTargetVal.toFixed(2)),
      causalDelta: parseFloat(causalDelta.toFixed(2)),
      percentChange: parseFloat(percentChange.toFixed(2)),
      intervenedGraphMutilation: mutilatedIncomingEdges,
      backdoorAdjustmentSet: backdoorSet,
      abducedNoise,
      formalDoCalculusFormula: formalDoFormula,
      confidenceInterval: [parseFloat(ci[0].toFixed(2)), parseFloat(ci[1].toFixed(2))],
      computationTimeMs: parseFloat(elapsed.toFixed(3)),
    };
  }
}
