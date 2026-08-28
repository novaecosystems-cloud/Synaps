#!/usr/bin/env bash
set -e

echo "🚀 Initializing Causarix Sovereign Codespace Environment..."

# 1. Install Node.js Dependencies & Generate Prisma Client
npm install --legacy-peer-deps
npx prisma generate

# 2. Install Agency Agents Skills into Global Config
mkdir -p ~/.gemini/config/skills

if [ ! -d "/tmp/agency-agents" ]; then
  git clone --depth 1 https://github.com/msitarzewski/agency-agents.git /tmp/agency-agents
  cd /tmp/agency-agents
  ./scripts/convert.sh
  ./scripts/install.sh --tool antigravity
  cd -
fi

echo "✅ Causarix Codespace Environment Ready! Run 'npm run dev' to start preview."
