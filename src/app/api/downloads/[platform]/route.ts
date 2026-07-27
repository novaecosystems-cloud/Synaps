import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform.toLowerCase();

  if (platform === 'mac' || platform === 'macos' || platform === 'dmg') {
    const launcherScript = `#!/bin/bash
# Synapse AI macOS Enterprise Launcher
echo "==================================================="
echo "  SYNAPSE AI - ENTERPRISE KNOWLEDGE ENGINE (macOS)"
echo "==================================================="
echo ""
echo "[1/2] Connecting to Synapse Enterprise Cloud..."
echo "[2/2] Opening Synapse Dashboard..."
open https://synaps-one.vercel.app/dashboard
`;

    return new NextResponse(launcherScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-sh',
        'Content-Disposition': 'attachment; filename="Synapse-macOS-Launcher.command"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  if (platform === 'win' || platform === 'windows' || platform === 'exe' || platform === 'zip') {
    const batContent = `@echo off
title Synapse AI Enterprise Desktop Launcher
echo ===================================================
echo   SYNAPSE AI - ENTERPRISE KNOWLEDGE ENGINE (Windows)
echo ===================================================
echo.
echo [1/2] Connecting to Synapse Enterprise Cloud...
echo [2/2] Opening Synapse Dashboard...
echo.
start https://synaps-one.vercel.app/dashboard
`;

    return new NextResponse(batContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-bat',
        'Content-Disposition': 'attachment; filename="Synapse-Windows-Launcher.bat"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  if (platform === 'cli') {
    const cliScript = `#!/usr/bin/env node
console.log("Synapse CLI v1.0.0");
console.log("Run: npx synapse ask 'summarize contract terms'");
`;

    return new NextResponse(cliScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Content-Disposition': 'attachment; filename="synapse-cli.js"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.json({ error: 'Unsupported download platform.' }, { status: 404 });
}
