import React from 'react';
import { Metadata } from 'next';
import CoworkHub from '@/components/cowork/CoworkHub';

export const metadata: Metadata = {
  title: 'Cowork & Universal MCP Bridge — Synaps AI',
  description: 'Collaborative multi-user AI workspaces, organization skill registry, and universal MCP server bridge for Claude Desktop, Cursor, and Antigravity.',
};

export default function CoworkDashboardPage() {
  return <CoworkHub />;
}
