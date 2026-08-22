/**
 * Causarix Autonomous E2E API Verification Engine (Inspired by OpenMOSS ABC-Bench)
 * 
 * Evaluates backend endpoints through real-world, full-lifecycle black-box HTTP probing:
 * 1. Dispatches real HTTP requests (GET, POST, PUT, DELETE)
 * 2. Measures true round-trip network & processing latency (ms)
 * 3. Asserts status codes, content-type headers, and payload structures
 * 4. Passes responses through Causarix Egress AI Firewall to prevent secret leaks
 * 5. Returns a structured verification report with zero hardcoded values
 */

import { inspectResponse } from "@/lib/ai-firewall";
import { validateScrapeUrl } from "@/lib/security";

export interface ApiProbeRequest {
  endpoint: string; // e.g. "/api/health", "/api/chat", or full URL
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  expectedStatus?: number;
  requiredKeys?: string[];
  maxLatencyMs?: number;
  timeoutMs?: number;
}

export interface ApiProbeResult {
  endpoint: string;
  method: string;
  status: number;
  statusText: string;
  isSuccess: boolean;
  latencyMs: number;
  responseHeaders: Record<string, string>;
  responseBody: any;
  assertionsPassed: string[];
  assertionsFailed: string[];
  firewallCheck: {
    isClean: boolean;
    redactedSecretsCount: number;
    flags: string[];
  };
  timestamp: string;
}

export interface BatchVerificationReport {
  suiteName: string;
  totalProbes: number;
  passedProbes: number;
  failedProbes: number;
  averageLatencyMs: number;
  allPassed: boolean;
  probes: ApiProbeResult[];
  timestamp: string;
}

/**
 * Executes a single black-box E2E HTTP verification probe against a backend endpoint.
 */
export async function verifyBackendEndpoint(
  probe: ApiProbeRequest,
  originUrl = "http://localhost:3000"
): Promise<ApiProbeResult> {
  const method = probe.method || "GET";
  const expectedStatus = probe.expectedStatus || (method === "POST" ? 200 : 200);
  const timeoutMs = probe.timeoutMs || 8000;
  const maxLatencyMs = probe.maxLatencyMs || 5000;

  // Resolve target URL
  let targetUrl = probe.endpoint;
  if (targetUrl.startsWith("/")) {
    targetUrl = `${originUrl.replace(/\/$/, "")}${targetUrl}`;
  } else {
    // External URL: validate against SSRF blocklist
    const urlCheck = validateScrapeUrl(targetUrl);
    if (!urlCheck.isValid) {
      return {
        endpoint: probe.endpoint,
        method,
        status: 400,
        statusText: "Blocked by SSRF Security Filter",
        isSuccess: false,
        latencyMs: 0,
        responseHeaders: {},
        responseBody: { error: urlCheck.reason },
        assertionsPassed: [],
        assertionsFailed: [`SSRF Filter blocked URL: ${urlCheck.reason}`],
        firewallCheck: { isClean: false, redactedSecretsCount: 0, flags: ["SSRF Target Blocked"] },
        timestamp: new Date().toISOString(),
      };
    }
  }

  const assertionsPassed: string[] = [];
  const assertionsFailed: string[] = [];

  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(probe.headers || {}),
  };

  let requestBody: string | undefined = undefined;
  if (probe.body && method !== "GET") {
    if (typeof probe.body === "string") {
      requestBody = probe.body;
    } else {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
      requestBody = JSON.stringify(probe.body);
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const res = await fetch(targetUrl, {
      method,
      headers,
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timer);
    const latencyMs = Date.now() - startTime;

    // Capture response headers
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    // Parse response body
    let rawText = "";
    let responseBody: any = null;
    try {
      rawText = await res.text();
      responseBody = JSON.parse(rawText);
    } catch (_) {
      responseBody = rawText;
    }

    // 1. Status Code Assertion
    if (res.status === expectedStatus || (expectedStatus === 200 && res.ok)) {
      assertionsPassed.push(`HTTP status ${res.status} matches expected (${expectedStatus})`);
    } else {
      assertionsFailed.push(`HTTP status ${res.status} did not match expected ${expectedStatus}`);
    }

    // 2. Latency Assertion
    if (latencyMs <= maxLatencyMs) {
      assertionsPassed.push(`Latency ${latencyMs}ms <= threshold (${maxLatencyMs}ms)`);
    } else {
      assertionsFailed.push(`Latency ${latencyMs}ms exceeded threshold (${maxLatencyMs}ms)`);
    }

    // 3. Payload Schema Assertions
    if (probe.requiredKeys && typeof responseBody === "object" && responseBody !== null) {
      for (const key of probe.requiredKeys) {
        if (key in responseBody) {
          assertionsPassed.push(`Response contains required property: "${key}"`);
        } else {
          assertionsFailed.push(`Response missing required property: "${key}"`);
        }
      }
    }

    // 4. Egress AI Firewall & Secret Leak Scrubber
    const firewallCheck = inspectResponse(rawText);

    const isSuccess = assertionsFailed.length === 0;

    return {
      endpoint: probe.endpoint,
      method,
      status: res.status,
      statusText: res.statusText,
      isSuccess,
      latencyMs,
      responseHeaders,
      responseBody: typeof responseBody === "object" ? responseBody : { raw: responseBody },
      assertionsPassed,
      assertionsFailed,
      firewallCheck: {
        isClean: firewallCheck.isSafe,
        redactedSecretsCount: firewallCheck.redactedCount,
        flags: firewallCheck.flaggedReasons,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    clearTimeout(timer);
    const latencyMs = Date.now() - startTime;
    const isTimeout = err.name === "AbortError";

    assertionsFailed.push(isTimeout ? `Request timed out after ${timeoutMs}ms` : `Connection failed: ${err.message}`);

    return {
      endpoint: probe.endpoint,
      method,
      status: 0,
      statusText: isTimeout ? "GATEWAY_TIMEOUT" : "CONNECTION_REFUSED",
      isSuccess: false,
      latencyMs,
      responseHeaders: {},
      responseBody: { error: err.message || "Network probe failed" },
      assertionsPassed,
      assertionsFailed,
      firewallCheck: { isClean: true, redactedSecretsCount: 0, flags: [] },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Runs an ABC-Bench style batch verification suite across multiple backend endpoints.
 */
export async function runApiBenchmarkSuite(
  suiteName: string,
  probes: ApiProbeRequest[],
  originUrl = "http://localhost:3000"
): Promise<BatchVerificationReport> {
  const results: ApiProbeResult[] = [];
  let totalLatency = 0;
  let passedCount = 0;

  for (const probe of probes) {
    const result = await verifyBackendEndpoint(probe, originUrl);
    results.push(result);
    totalLatency += result.latencyMs;
    if (result.isSuccess) passedCount++;
  }

  const avgLatency = probes.length > 0 ? Math.round(totalLatency / probes.length) : 0;

  return {
    suiteName,
    totalProbes: probes.length,
    passedProbes: passedCount,
    failedProbes: probes.length - passedCount,
    averageLatencyMs: avgLatency,
    allPassed: passedCount === probes.length,
    probes: results,
    timestamp: new Date().toISOString(),
  };
}
