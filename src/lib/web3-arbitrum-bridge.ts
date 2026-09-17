import { keccak256, toHex, encodePacked, stringToHex, Hex } from "viem";
import deploymentData from "@/contracts/arbitrum-deployment.json";

export interface DeliberationPayload {
  proposalId: string;
  title: string;
  description: string;
  cfoAnalysis: string;
  legalAnalysis: string;
  securityAnalysis: string;
  ruinProbability: number; // 0 - 100
  consensusScore: number;  // 0 - 100
  scmParams: {
    iterations: number;
    driftPercent: number;
    var95: number;
    cvar95: number;
    seed: string;
  };
}

export interface ArbitrumSealingPackage {
  proposalHash: Hex;
  merkleRoot: Hex;
  leaves: Hex[];
  ruinProbability: number;
  consensusScore: number;
  ipfsReportUri: string;
  contractAddress: `0x${string}`;
  chainId: number;
  explorerUrl: string;
  contractExplorerUrl: string;
}

/**
 * Computes a standard sorted-pair binary Keccak-256 Merkle tree compatible with
 * OpenZeppelin MerkleProof and the Arbitrum Stylus Rust verifier.
 */
export function computeKeccakMerkleTree(leaves: Hex[]): { root: Hex; layers: Hex[][] } {
  if (leaves.length === 0) {
    return { root: "0x0000000000000000000000000000000000000000000000000000000000000000", layers: [] };
  }

  let currentLevel = [...leaves];
  const layers: Hex[][] = [[...currentLevel]];

  while (currentLevel.length > 1) {
    const nextLevel: Hex[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1];
        // Sort pairs lexicographically for standard OpenZeppelin / Stylus verification
        const combined = left.toLowerCase() <= right.toLowerCase()
          ? keccak256(encodePacked(["bytes32", "bytes32"], [left, right]))
          : keccak256(encodePacked(["bytes32", "bytes32"], [right, left]));
        nextLevel.push(combined);
      } else {
        // Odd leaf carried over
        nextLevel.push(currentLevel[i]);
      }
    }
    currentLevel = nextLevel;
    layers.push([...currentLevel]);
  }

  return { root: currentLevel[0], layers };
}

/**
 * Prepares the evidentiary payload into a cryptographic package ready for
 * on-chain sealing to Arbitrum Sepolia or Stylus.
 */
export function prepareArbitrumSeal(payload: DeliberationPayload): ArbitrumSealingPackage {
  // 1. Generate Proposal Hash
  const proposalHash = keccak256(
    stringToHex(`${payload.proposalId.trim().toUpperCase()}:${payload.title.trim()}`)
  );

  // 2. Generate 5 Canonical Evidentiary Leaves
  const leaf0 = keccak256(stringToHex(`PROPOSAL:${payload.proposalId}:${payload.description}`));
  const leaf1 = keccak256(stringToHex(`CFO_FINANCIAL_RUNWAY:${payload.cfoAnalysis}`));
  const leaf2 = keccak256(stringToHex(`DGCL_FIDUCIARY_LEGAL:${payload.legalAnalysis}`));
  const leaf3 = keccak256(stringToHex(`PROTOCOL_EXPLOIT_SECURITY:${payload.securityAnalysis}`));
  const leaf4 = keccak256(stringToHex(`SCM_BOX_MULLER_PARAMS:${JSON.stringify(payload.scmParams)}`));

  const leaves = [leaf0, leaf1, leaf2, leaf3, leaf4];

  // 3. Compute Keccak-256 Merkle Root
  const { root: merkleRoot } = computeKeccakMerkleTree(leaves);

  // 4. Generate Mock IPFS CID based on SHA-256 digest
  const ipfsReportUri = `ipfs://bafkrei${merkleRoot.slice(2, 46)}causarixfiduciaryaudit`;

  const contractAddress = (deploymentData.contractAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e") as `0x${string}`;

  return {
    proposalHash,
    merkleRoot,
    leaves,
    ruinProbability: Math.min(100, Math.max(0, Math.round(payload.ruinProbability))),
    consensusScore: Math.min(100, Math.max(0, Math.round(payload.consensusScore))),
    ipfsReportUri,
    contractAddress,
    chainId: deploymentData.chainId || 421614,
    explorerUrl: deploymentData.explorerUrl || "https://sepolia.arbiscan.io",
    contractExplorerUrl: `https://sepolia.arbiscan.io/address/${contractAddress}`,
  };
}

export function formatArbiscanTxUrl(txHash: string): string {
  const cleanHash = txHash.startsWith("0x") ? txHash : `0x${txHash}`;
  return `https://sepolia.arbiscan.io/tx/${cleanHash}`;
}