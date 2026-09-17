// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArbitrumFiduciaryRegistry
 * @notice Cryptographic Fiduciary Governance & Attestation Registry for Arbitrum DAOs, Treasuries, and Protocols.
 * @dev Implements Delaware General Corporation Law (DGCL) § 141(e) safe-harbor compliance by anchoring
 *      multi-agent boardroom deliberations, Monte Carlo SCM ruin probabilities, and SHA-256/Keccak-256 Merkle roots
 *      directly on Arbitrum with sub-second finality and low gas costs.
 */
contract ArbitrumFiduciaryRegistry {
    
    struct FiduciarySeal {
        bytes32 proposalHash;       // Keccak-256 hash of the proposal title/body/AIP ID
        bytes32 merkleRoot;         // Merkle root of the 3-agent deliberation + SCM parameters
        uint8 ruinProbability;      // 0-100% computed insolvency/ruin risk from 10,000 SCM iterations
        uint8 consensusScore;       // 0-100 composite confidence score from the Risk Council
        uint256 timestamp;          // Block timestamp when sealed on Arbitrum
        address sealer;             // Address of the DAO delegate or director submitting the attestation
        string ipfsReportUri;       // IPFS CID containing the complete coordinate-level evidentiary audit package
        bool exists;                // Existence check flag
    }

    /// @notice Total number of sealed governance records on Arbitrum
    uint256 public totalSeals;

    /// @notice Mapping from proposalHash to FiduciarySeal record
    mapping(bytes32 => FiduciarySeal) public seals;

    /// @notice Array of all proposal hashes for indexed enumeration
    bytes32[] public allProposalHashes;

    /// @notice Mapping of delegate address to list of sealed proposal hashes
    mapping(address => bytes32[]) public delegateProposals;

    // Events
    event DeliberationSealed(
        bytes32 indexed proposalHash,
        bytes32 indexed merkleRoot,
        address indexed sealer,
        uint8 ruinProbability,
        uint8 consensusScore,
        uint256 timestamp,
        string ipfsReportUri
    );

    event ProofOfDiligenceAttested(
        address indexed delegate,
        bytes32 indexed proposalHash,
        bytes32 merkleRoot,
        uint256 timestamp
    );

    /**
     * @notice Seals an evidentiary deliberation onto Arbitrum.
     * @param proposalHash Unique hash of the DAO proposal / treasury allocation.
     * @param merkleRoot Cryptographic Merkle root of the deliberation tree.
     * @param ruinProbability Value-at-Risk / insolvency probability (0-100).
     * @param consensusScore Overall risk council consensus score (0-100).
     * @param ipfsReportUri IPFS CID containing full evidentiary audit trail.
     */
    function sealDeliberation(
        bytes32 proposalHash,
        bytes32 merkleRoot,
        uint8 ruinProbability,
        uint8 consensusScore,
        string calldata ipfsReportUri
    ) external returns (bool) {
        require(proposalHash != bytes32(0), "Invalid proposal hash");
        require(merkleRoot != bytes32(0), "Invalid merkle root");
        require(ruinProbability <= 100, "Ruin probability must be <= 100");
        require(consensusScore <= 100, "Consensus score must be <= 100");

        if (!seals[proposalHash].exists) {
            allProposalHashes.push(proposalHash);
            totalSeals++;
        }

        seals[proposalHash] = FiduciarySeal({
            proposalHash: proposalHash,
            merkleRoot: merkleRoot,
            ruinProbability: ruinProbability,
            consensusScore: consensusScore,
            timestamp: block.timestamp,
            sealer: msg.sender,
            ipfsReportUri: ipfsReportUri,
            exists: true
        });

        delegateProposals[msg.sender].push(proposalHash);

        emit DeliberationSealed(
            proposalHash,
            merkleRoot,
            msg.sender,
            ruinProbability,
            consensusScore,
            block.timestamp,
            ipfsReportUri
        );

        emit ProofOfDiligenceAttested(
            msg.sender,
            proposalHash,
            merkleRoot,
            block.timestamp
        );

        return true;
    }

    /**
     * @notice Verifies whether a given deliberation was sealed and returns its full record.
     * @param proposalHash Unique hash of the proposal.
     * @param expectedRoot Expected Merkle root to check against.
     */
    function verifyDeliberation(
        bytes32 proposalHash,
        bytes32 expectedRoot
    ) external view returns (bool isValid, FiduciarySeal memory seal) {
        seal = seals[proposalHash];
        if (!seal.exists) {
            return (false, seal);
        }
        isValid = (seal.merkleRoot == expectedRoot);
        return (isValid, seal);
    }

    /**
     * @notice Returns the total count of sealed proposals.
     */
    function getSealsCount() external view returns (uint256) {
        return allProposalHashes.length;
    }

    /**
     * @notice Returns proposal hashes sealed by a specific delegate.
     */
    function getProposalsByDelegate(address delegate) external view returns (bytes32[] memory) {
        return delegateProposals[delegate];
    }

    /**
     * @notice Fetches the latest N sealed deliberations for dashboard activity feeds.
     */
    function getLatestSeals(uint256 count) external view returns (FiduciarySeal[] memory) {
        uint256 total = allProposalHashes.length;
        if (count > total) {
            count = total;
        }

        FiduciarySeal[] memory recentSeals = new FiduciarySeal[](count);
        for (uint256 i = 0; i < count; i++) {
            bytes32 pHash = allProposalHashes[total - 1 - i];
            recentSeals[i] = seals[pHash];
        }

        return recentSeals;
    }
}
