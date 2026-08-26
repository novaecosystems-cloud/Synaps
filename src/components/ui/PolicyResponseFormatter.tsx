'use client';

import React from 'react';
import { Bookmark, Compass } from 'lucide-react';

interface FormatterProps {
  text: string;
}

export default function PolicyResponseFormatter({ text }: FormatterProps) {
  if (!text) return null;

  // Clean raw text formatting
  const formattedText = text.trim();

  // Split into lines/paragraphs or parse section headers
  // E.g., headers like **Risk Assessment**, ### 1. Risk Assessment, **Citations:**
  const sections = parsePolicyText(formattedText);

  return (
    <div className="space-y-4 text-xs font-sans leading-relaxed text-base-content/90">
      {sections.map((section, idx) => {
        if (section.type === 'citation') {
          return (
            <div key={idx} className="mt-4 p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Bookmark className="w-3.5 h-3.5" /> Documented Policy Citations
              </div>
              <ul className="space-y-1.5 pl-2">
                {section.items?.map((cit, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2 text-xs text-indigo-300/90 font-medium">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{cit}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (section.type === 'heading') {
          return (
            <div key={idx} className="pt-2 pb-1 border-b border-base-200 flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-indigo-400 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                {section.title}
              </h4>
            </div>
          );
        }

        if (section.type === 'list') {
          return (
            <div key={idx} className="space-y-2 my-2">
              {section.title && (
                <h5 className="font-extrabold text-xs text-base-content uppercase tracking-wider">{section.title}</h5>
              )}
              <div className="grid grid-cols-1 gap-2">
                {section.items?.map((item, iIdx) => (
                  <div key={iIdx} className="p-3 bg-base-200/60 rounded-xl border border-base-300 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20">
                      {iIdx + 1}
                    </div>
                    <div className="text-xs leading-relaxed text-base-content/90 font-medium">
                      {formatBoldText(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs leading-relaxed text-base-content/90 font-normal">
            {formatBoldText(section.content || '')}
          </p>
        );
      })}
    </div>
  );
}

// Function to format inline **bold** text into strong tags cleanly
function formatBoldText(str: string) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold text-white bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 text-indigo-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Helper parser to break unformatted LLM output into clean structured blocks
function parsePolicyText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const sections: Array<{
    type: 'heading' | 'paragraph' | 'list' | 'citation';
    title?: string;
    content?: string;
    items?: string[];
  }> = [];

  // Handle inline markdown header format or raw asterisks
  let currentList: string[] = [];
  let currentTitle = '';

  // First check if text contains **Citations:**
  let citationIndex = text.indexOf('**Citations:**');
  if (citationIndex === -1) citationIndex = text.indexOf('Citations:');

  let mainBody = text;
  let citationsRaw = '';

  if (citationIndex !== -1) {
    mainBody = text.substring(0, citationIndex).trim();
    citationsRaw = text.substring(citationIndex).replace(/\*\*Citations:\*\*/i, '').replace(/Citations:/i, '').trim();
  }

  // Break mainBody by Double Asterisks or Paragraph breaks
  const rawParagraphs = mainBody.split(/(?=\*\*[^*]+\*\*)|(?=\n\n)/g).filter(Boolean);

  for (const block of rawParagraphs) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check if block starts with **Header**
    const headerMatch = trimmed.match(/^(\*\*.*?\*\*|###?\s*.*|\d+\.\s*\*\*.*?\*\*)/);
    if (headerMatch) {
      const headerTitle = headerMatch[0].replace(/\*/g, '').replace(/^###?\s*/, '').trim();
      const bodyContent = trimmed.substring(headerMatch[0].length).trim();

      sections.push({
        type: 'heading',
        title: headerTitle
      });

      if (bodyContent) {
        // Check if body content is a numbered list
        if (bodyContent.match(/\d+\.\s/)) {
          const listItems = bodyContent.split(/(?=\d+\.\s)/).map(i => i.trim()).filter(Boolean);
          sections.push({
            type: 'list',
            items: listItems.map(i => i.replace(/^\d+\.\s*/, ''))
          });
        } else {
          sections.push({
            type: 'paragraph',
            content: bodyContent
          });
        }
      }
    } else {
      sections.push({
        type: 'paragraph',
        content: trimmed
      });
    }
  }

  // Add citations if present
  if (citationsRaw) {
    const cItems = citationsRaw
      .split(/[*•\n\d+\.]/)
      .map(c => c.trim().replace(/^\*/, '').trim())
      .filter(c => c.length > 5);

    if (cItems.length > 0) {
      sections.push({
        type: 'citation',
        items: cItems
      });
    }
  }

  // Fallback if parser produces nothing
  if (sections.length === 0) {
    sections.push({
      type: 'paragraph',
      content: text
    });
  }

  return sections;
}
