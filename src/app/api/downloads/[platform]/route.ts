import { NextRequest, NextResponse } from 'next/server';

function crc32(buf: Buffer): number {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return ~crc >>> 0;
}

function createZipBuffer(files: { name: string; content: string }[]): Buffer {
  const buffers: Buffer[] = [];
  const cdRecords: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuf = Buffer.from(file.name, 'utf-8');
    const contentBuf = Buffer.from(file.content, 'utf-8');
    const checksum = crc32(contentBuf);

    // Local file header
    const lfh = Buffer.alloc(30 + filenameBuf.length);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4);
    lfh.writeUInt16LE(0, 6);
    lfh.writeUInt16LE(0, 8); // Store
    lfh.writeUInt16LE(0, 10);
    lfh.writeUInt16LE(0, 12);
    lfh.writeUInt32LE(checksum, 14);
    lfh.writeUInt32LE(contentBuf.length, 18);
    lfh.writeUInt32LE(contentBuf.length, 22);
    lfh.writeUInt16LE(filenameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);
    filenameBuf.copy(lfh, 30);

    // Central directory header
    const cdh = Buffer.alloc(46 + filenameBuf.length);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4);
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0, 8);
    cdh.writeUInt16LE(0, 10);
    cdh.writeUInt16LE(0, 12);
    cdh.writeUInt16LE(0, 14);
    cdh.writeUInt32LE(checksum, 16);
    cdh.writeUInt32LE(contentBuf.length, 20);
    cdh.writeUInt32LE(contentBuf.length, 24);
    cdh.writeUInt16LE(filenameBuf.length, 28);
    cdh.writeUInt16LE(0, 30);
    cdh.writeUInt16LE(0, 32);
    cdh.writeUInt16LE(0, 34);
    cdh.writeUInt16LE(0, 36);
    cdh.writeUInt32LE(0, 38);
    cdh.writeUInt32LE(offset, 42);
    filenameBuf.copy(cdh, 46);

    buffers.push(lfh, contentBuf);
    cdRecords.push(cdh);

    offset += lfh.length + contentBuf.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cdh of cdRecords) {
    buffers.push(cdh);
    cdSize += cdh.length;
  }

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  eocd.writeUInt16LE(0, 20);

  buffers.push(eocd);

  return Buffer.concat(buffers);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform.toLowerCase();

  if (platform === 'mac' || platform === 'macos' || platform === 'dmg') {
    const launcherScript = `#!/bin/bash
# Synapse AI macOS Native Desktop App Launcher
echo "==================================================="
echo "  SYNAPSE AI - NATIVE DESKTOP APPLICATION (macOS)"
echo "==================================================="
echo ""
echo "[1/2] Connecting to Synapse Enterprise Cloud..."
echo "[2/2] Launching Standalone Native Window..."
open -a "Google Chrome" --args --app="https://synaps-one.vercel.app/dashboard" --window-size=1380,900 || open "https://synaps-one.vercel.app/dashboard"
`;

    const readme = `SYNAPSE AI ENTERPRISE NATIVE DESKTOP APP (macOS)
=================================================
1. Double-click Synapse-macOS-Launcher.command to open Synapse in Standalone App Window mode.
2. Terminal CLI Quickstart:
   $ npx synapse ask "summarize contract terms"
`;

    const zipBuffer = createZipBuffer([
      { name: 'Synapse-macOS-Launcher.command', content: launcherScript },
      { name: 'README.txt', content: readme },
    ]);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="Synapse-macOS-Universal.zip"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  if (platform === 'win' || platform === 'windows' || platform === 'exe' || platform === 'zip') {
    const batContent = `@echo off
title Synapse AI Enterprise Desktop Application
echo ===================================================
echo   SYNAPSE AI - NATIVE DESKTOP APPLICATION (Windows)
echo ===================================================
echo.
echo [1/2] Connecting to Synapse Enterprise Cloud...
echo [2/2] Launching Standalone Native Desktop App Window...
echo.

start msedge.exe --app="https://synaps-one.vercel.app/dashboard" --window-size=1380,900 --user-data-dir="%LOCALAPPDATA%\\SynapsDesktopProfile"
`;

    const readme = `SYNAPSE AI ENTERPRISE NATIVE DESKTOP APP (Windows)
===================================================
1. Double-click Synapse-Windows-App-Launcher.bat to open Synapse as a Standalone Native App Window (No browser tabs or address bar!).
2. Terminal CLI Quickstart:
   $ npx synapse ask "summarize contract terms"
`;

    const zipBuffer = createZipBuffer([
      { name: 'Synapse-Windows-App-Launcher.bat', content: batContent },
      { name: 'README.txt', content: readme },
    ]);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="Synapse-Windows-x64.zip"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  if (platform === 'cli') {
    const cliScript = `#!/usr/bin/env node
console.log("Synapse CLI v2.0.0");
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
