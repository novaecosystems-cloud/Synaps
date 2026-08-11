/**
 * Synaps Enterprise Appwrite Integration Service
 * 
 * SECURITY GUARANTEE:
 * APPWRITE_API_KEY is strictly accessed on the server via process.env.APPWRITE_API_KEY.
 * It is NEVER exposed to the frontend/browser context or prefixed with NEXT_PUBLIC_.
 */

export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  apiKey?: string;
}

export function getAppwriteConfig(): AppwriteConfig {
  return {
    endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'synaps-production',
    apiKey: process.env.APPWRITE_API_KEY, // SERVER ONLY KEY
  };
}

/**
 * Perform authenticated Appwrite Server REST API Requests
 */
export async function appwriteServerFetch<T = any>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const config = getAppwriteConfig();
    
    if (!config.apiKey && typeof window === 'undefined') {
      // Graceful fallback logging for optional Appwrite setup
      console.warn('[Appwrite Server]: APPWRITE_API_KEY is not set in process.env. Requests will run in guest/public scope.');
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': config.projectId,
      ...(options.headers || {}),
    };

    // Inject Server API Key only if present (Server context)
    if (config.apiKey) {
      requestHeaders['X-Appwrite-Key'] = config.apiKey;
    }

    const response = await fetch(`${config.endpoint}${path}`, {
      method: options.method || 'GET',
      headers: requestHeaders,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Appwrite Error HTTP ${response.status}`,
      };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Appwrite Fetch Error]:', err);
    return {
      success: false,
      error: err.message || 'Failed to connect to Appwrite service',
    };
  }
}

/**
 * Health check endpoint for Appwrite integration status
 */
export async function checkAppwriteHealth(): Promise<{
  connected: boolean;
  endpoint: string;
  hasApiKey: boolean;
  message: string;
}> {
  const config = getAppwriteConfig();
  const hasApiKey = Boolean(config.apiKey);
  
  const res = await appwriteServerFetch('/health');
  
  return {
    connected: res.success,
    endpoint: config.endpoint,
    hasApiKey,
    message: res.success
      ? 'Appwrite Server connection healthy and authenticated.'
      : `Appwrite status: ${res.error || 'Server reachable'}`,
  };
}

/**
 * Server-side Document Store Operations
 */
export const AppwriteDatabaseService = {
  async listDocuments(databaseId: string, collectionId: string) {
    return appwriteServerFetch(`/databases/${databaseId}/collections/${collectionId}/documents`);
  },

  async createDocument(databaseId: string, collectionId: string, documentId: string, data: Record<string, any>) {
    return appwriteServerFetch(`/databases/${databaseId}/collections/${collectionId}/documents`, {
      method: 'POST',
      body: { documentId: documentId || 'unique()', data },
    });
  },

  async getDocument(databaseId: string, collectionId: string, documentId: string) {
    return appwriteServerFetch(`/databases/${databaseId}/collections/${collectionId}/documents/${documentId}`);
  },
};
