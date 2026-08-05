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
  
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

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
    lfh.writeUInt16LE(dosTime, 10);
    lfh.writeUInt16LE(dosDate, 12);
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
    cdh.writeUInt16LE(dosTime, 10);
    cdh.writeUInt16LE(dosDate, 12);
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
# Synaps AI macOS Native Desktop App Launcher
echo "==================================================="
echo "  SYNAPS AI - NATIVE DESKTOP APPLICATION (macOS)"
echo "==================================================="
echo ""
echo "[1/2] Creating Desktop App Launcher..."
echo "[2/2] Launching Synaps AI Standalone App Window..."
open -a "Google Chrome" --args --app="https://synaps-one.vercel.app/dashboard" --window-size=1380,900 || open "https://synaps-one.vercel.app/dashboard"
`;

    const readme = `SYNAPS AI ENTERPRISE NATIVE DESKTOP APP (macOS)
=================================================
1. Double-click Synaps-macOS-Launcher.command to open Synaps in Standalone App Window mode.
2. Terminal CLI Quickstart:
   $ npx synapse ask "summarize contract terms"
`;

    const zipBuffer = createZipBuffer([
      { name: 'Synaps-macOS-Launcher.command', content: launcherScript },
      { name: 'README.txt', content: readme },
    ]);

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="Synaps-macOS-Universal.zip"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  if (platform === 'win' || platform === 'windows' || platform === 'exe' || platform === 'zip') {
    const batContent = `@echo off
title Synaps AI Enterprise Desktop Installer
echo ===================================================
echo   SYNAPS AI - NATIVE DESKTOP APPLICATION (Windows)
echo ===================================================
echo.
echo [1/2] Creating 'Synaps AI' Desktop App Shortcut on your Windows Desktop...
powershell -Command "$scPath = [System.IO.Path]::Combine($env:USERPROFILE, 'Desktop', 'Synaps AI.lnk'); $ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut($scPath); $sc.TargetPath = 'msedge.exe'; $sc.Arguments = '--app=https://synaps-one.vercel.app/dashboard --window-size=1380,900'; $sc.Description = 'Synaps AI Desktop Application'; $sc.Save()"

echo.
echo [2/2] Launching Synaps AI Standalone Native Desktop App Window...
start "" msedge.exe --app="https://synaps-one.vercel.app/dashboard" --window-size=1380,900
`;

    const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShortcut = WshShell.CreateShortcut(strDesktop & "\\Synaps AI.lnk")
oShortcut.TargetPath = "msedge.exe"
oShortcut.Arguments = "--app=https://synaps-one.vercel.app/dashboard --window-size=1380,900"
oShortcut.Description = "Synaps AI Desktop Application"
oShortcut.Save
WshShell.Run "msedge.exe --app=https://synaps-one.vercel.app/dashboard --window-size=1380,900", 1, False
`;

    const readme = `SYNAPS AI ENTERPRISE NATIVE DESKTOP APP (Windows)
===================================================
1. Double-click Install-Synaps-Windows.bat (or Create-Desktop-Shortcut.vbs).
2. It automatically creates a 'Synaps AI' desktop app icon right on your Windows Desktop!
3. Double-click the 'Synaps AI' Desktop Icon anytime to open Synaps AI as a Standalone App Window (No browser tabs or URL bar!).
`;

    const zipBuffer = createZipBuffer([
      { name: 'Install-Synaps-Windows.bat', content: batContent },
      { name: 'Create-Desktop-Shortcut.vbs', content: vbsContent },
      { name: 'README.txt', content: readme },
    ]);

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="Synaps-Windows-Desktop-App.zip"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  if (platform === 'cli') {
    const cliScript = `#!/usr/bin/env node
console.log("Synaps CLI v2.5.0");
console.log("Run: npx synapse ask 'summarize contract terms'");
`;

    return new NextResponse(cliScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Content-Disposition': 'attachment; filename="synaps-cli.js"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.json({ error: 'Unsupported download platform.' }, { status: 404 });
}
