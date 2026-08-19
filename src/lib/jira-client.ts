/**
 * Atlassian Jira Cloud REST API Client
 * 
 * Creates automated mitigation tickets, risk audits, and board action items
 * directly on the user's Jira board from Causarix boardroom deliberations.
 */

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
    const cleanDomain = config.domain.replace(/\/$/, "");
    const authHeader = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64");

    const payload = {
      fields: {
        project: {
          key: config.projectKey.toUpperCase()
        },
        summary: params.summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: params.description
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
