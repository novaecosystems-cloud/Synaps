/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX™ MULTI-MODEL TRIAD ROUTER & ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects, manages, and routes queries across the 3 custom-trained domain brains:
 *   1. Causarix-Global-Legal   (Delaware DGCL § 141, UK § 172, EU CSDDD/GDPR)
 *   2. Causarix-Global-Finance (US GAAP ASC 606/842, IFRS 15/16, EBITDA Drag)
 *   3. Causarix-Global-Causal  (Judea Pearl do-calculus, Merkle Proof Quorum)
 */

import fs from 'fs';
import path from 'path';

export interface TriadModelInfo {
  id: string;
  name: string;
  domain: 'legal' | 'finance' | 'causal';
  path: string;
  isAvailable: boolean;
  sizeBytes: number;
  parameters: string;
  specialization: string[];
}

export function getTriadModelsStatus(baseDir: string = process.cwd()): Record<string, TriadModelInfo> {
  const modelsDir = path.join(baseDir, 'models');

  const models: Record<string, { name: string; domain: 'legal' | 'finance' | 'causal'; dirName: string; specs: string[] }> = {
    legal: {
      name: 'Causarix-Global-Legal (7B)',
      domain: 'legal',
      dirName: 'causarix-global-7b-lora',
      specs: ['Delaware DGCL § 141(e) Safe Harbor', 'UK Companies Act 2006 § 172', 'EU CSDDD & GDPR Arts. 28/82', 'India DPDP 2023 & SG PDPA']
    },
    finance: {
      name: 'Causarix-Global-Finance (7B)',
      domain: 'finance',
      dirName: 'causarix-global-finance-7b-lora',
      specs: ['US GAAP (ASC 606 / 842)', 'IFRS 15 & IFRS 16 Revenue Leases', 'OECD BEPS Transfer Pricing', 'Pro-Forma EBITDA Runway Drag']
    },
    causal: {
      name: 'Causarix-Global-Causal (7B)',
      domain: 'causal',
      dirName: 'causarix-global-causal-7b-lora',
      specs: ['Judea Pearl SCM Do-Calculus Surgery', '10-Agent Boardroom Quorum Consensus', 'Delaware DGCL § 141 Merkle Proof Sealing', '0.00% Math Drift Invariant']
    }
  };

  const status: Record<string, TriadModelInfo> = {};

  for (const [key, cfg] of Object.entries(models)) {
    const fullPath = path.join(modelsDir, cfg.dirName);
    const safetensorsPath = path.join(fullPath, 'adapter_model.safetensors');
    const isAvailable = fs.existsSync(safetensorsPath);
    let sizeBytes = 0;

    if (isAvailable) {
      try {
        const stat = fs.statSync(safetensorsPath);
        sizeBytes = stat.size;
      } catch (e) {}
    }

    status[key] = {
      id: key,
      name: cfg.name,
      domain: cfg.domain,
      path: fullPath,
      isAvailable,
      sizeBytes,
      parameters: '7.61B + 40.4MB LoRA',
      specialization: cfg.specs
    };
  }

  return status;
}

export function routeDomainToTriadModel(query: string): 'legal' | 'finance' | 'causal' {
  const lower = query.toLowerCase();

  if (lower.includes('ebitda') || lower.includes('gaap') || lower.includes('ifrs') || lower.includes('revenue') || lower.includes('balance sheet') || lower.includes('runway')) {
    return 'finance';
  }

  if (lower.includes('causal') || lower.includes('do-calculus') || lower.includes('counterfactual') || lower.includes('boardroom') || lower.includes('quorum') || lower.includes('merkle')) {
    return 'causal';
  }

  return 'legal'; // Default to legal & governance
}
