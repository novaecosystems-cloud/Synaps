import React from 'react';
import { Metadata } from 'next';
import BookToSkillStudio from '@/components/skills/BookToSkillStudio';

export const metadata: Metadata = {
  title: 'Playbook to Skill (24x RAG) — Synaps AI',
  description: 'Distill long-form legal playbooks and manuals into modular, executable Agent Skills with 24x-51x token reduction.',
};

export default function SkillsDashboardPage() {
  return <BookToSkillStudio />;
}
