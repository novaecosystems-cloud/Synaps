import { NextRequest, NextResponse } from 'next/server';
import { createJiraIssue, JiraConfig } from '@/lib/jira-client';
import { resolveAuthContext, safeErrorResponse } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    await resolveAuthContext(req);
    const body = await req.json();
    const { domain, email, apiToken, projectKey, summary, description, issueType } = body;

    const config: JiraConfig = {
      domain: domain || process.env.JIRA_DOMAIN || '',
      email: email || process.env.JIRA_EMAIL || '',
      apiToken: apiToken || process.env.JIRA_API_TOKEN || '',
      projectKey: projectKey || process.env.JIRA_PROJECT_KEY || 'KAN',
    };

    if (!config.domain || !config.email || !config.apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Missing Jira credentials. Please provide domain, email, and apiToken.'
      }, { status: 400 });
    }

    const result = await createJiraIssue(config, {
      summary: summary || '[Causarix Invariant] Action Item from Boardroom Deliberation',
      description: description || 'Generated automatically by Causarix AI Autonomous Boardroom.',
      issueType: issueType || 'Task'
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return safeErrorResponse(error, 'Failed to dispatch Jira issue');
  }
}

