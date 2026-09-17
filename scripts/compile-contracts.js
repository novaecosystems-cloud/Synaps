const fs = require("fs");
const path = require("path");
const solc = require("solc");

const contractPath = path.resolve(__dirname, "../contracts/ArbitrumFiduciaryRegistry.sol");
let source = fs.readFileSync(contractPath, "utf8");
if (source.charCodeAt(0) === 0xFEFF) {
  source = source.slice(1);
}
fs.writeFileSync(contractPath, source, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "ArbitrumFiduciaryRegistry.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

console.log("Compiling ArbitrumFiduciaryRegistry.sol with solc...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasFatal = false;
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
    if (err.severity === "error") hasFatal = true;
  });
  if (hasFatal) {
    process.exit(1);
  }
}

const contract = output.contracts["ArbitrumFiduciaryRegistry.sol"]["ArbitrumFiduciaryRegistry"];
const outDir = path.resolve(__dirname, "../src/contracts");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const artifact = {
  contractName: "ArbitrumFiduciaryRegistry",
  abi: contract.abi,
  bytecode: "0x" + contract.evm.bytecode.object,
  compilerVersion: solc.version(),
  compiledAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(outDir, "ArbitrumFiduciaryRegistry.json"),
  JSON.stringify(artifact, null, 2),
  "utf8"
);

console.log("Compilation successful! Artifact saved to src/contracts/ArbitrumFiduciaryRegistry.json");
console.log("Bytecode length:", artifact.bytecode.length, "bytes");