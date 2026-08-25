/**
 * Atlassian Jira Cloud REST API Client
 * 
 * Creates automated mitigation tickets, risk audits, and board action items
 * directly on the user's Jira board from Causarix boardroom deliberations.
 */

import { inspectResponse } from "@/lib/ai-firewall";
import { validateScrapeUrl } from "@/lib/security";

export interface JiraConfig {
  domain: string; // e.g. "https://your-domain.atlassian.net"
  email: string;
  apiToken: string;
  projectKey: string; // e.g. "KAN"
}

export interface CreateJiraIssueParams {
  summary: string;
  description: string;
  issueType?: string; // "Task" | "Bug" | "Story"
  priority?: "High" | "Highest" | "Medium" | "Low";
}

export async function createJiraIssue(config: JiraConfig, params: CreateJiraIssueParams): Promise<{
  success: boolean;
  issueKey?: string;
  issueUrl?: string;
  error?: string;
}> {
  try {
    // 1. SSRF Validation
    const urlCheck = validateScrapeUrl(config.domain);
    if (!urlCheck.valid) {
      return {
        success: false,
        error: `Invalid Jira domain (SSRF blocked): ${urlCheck.error}`
      };
    }

    const cleanDomain = (urlCheck.cleanUrl || config.domain).replace(/\/$/, "");
    const authHeader = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64");

    // 2. AI Firewall Egress Scrubbing
    const cleanSummary = inspectResponse(params.summary).sanitizedOutput;
    const cleanDescription = inspectResponse(params.description).sanitizedOutput;

    const payload = {
      fields: {
        project: {
          key: config.projectKey.toUpperCase()
        },
        summary: cleanSummary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: cleanDescription
                }
              ]
            }
          ]
        },
        issuetype: {
          name: params.issueType || "Task"
        }
      }
    };

    const res = await fetch(`${cleanDomain}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        error: `Jira API responded with ${res.status}: ${errorText}`
      };
    }

    const data = await res.json();
    return {
      success: true,
      issueKey: data.key,
      issueUrl: `${cleanDomain}/browse/${data.key}`
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to communicate with Jira API"
    };
  }
}
