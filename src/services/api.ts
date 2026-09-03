/**
 * Centralized API Service for Home Assistant Edge AI & Subsystems
 * Supports dynamic Ingress Base URL, Standalone Web, and Local Container execution.
 */

import { HardwareEntity, AutomationRule } from '../types';

/**
 * Dynamically resolves the API base URL.
 * Detects Home Assistant Ingress URL prefixes like `/api/hassio_ingress/<token>`
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const ingressMatch = path.match(/(\/api\/hassio_ingress\/[^/]+)/);
    if (ingressMatch) {
      return ingressMatch[1];
    }
  }
  return '';
}

/**
 * Builds a fully qualified API URL preserving Home Assistant Ingress prefixes.
 */
export function getApiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}

/**
 * Universal Fetch wrapper with automatic Ingress routing and error handling.
 */
export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = getApiUrl(endpoint);
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string> || {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let parsedError: any = null;
    try {
      parsedError = JSON.parse(errorText);
    } catch {}
    throw new Error(parsedError?.error || parsedError?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ==========================================
// HOME ASSISTANT API CLIENT
// ==========================================

export async function fetchHaStates(): Promise<{
  success: boolean;
  states: HardwareEntity[];
  entities: HardwareEntity[];
  mode: string;
  connected: boolean;
  diagnostic?: any;
}> {
  return apiFetch('/api/ha/states');
}

export async function fetchHaStatus(): Promise<{
  success: boolean;
  connected: boolean;
  mode: string;
  haUrl: string;
  version: string;
  locationName: string;
  entitiesCount: number;
  lastSynced: string;
  supervisorTokenPresent: boolean;
  hasCustomToken: boolean;
  diagnostic?: any;
}> {
  return apiFetch('/api/ha/status');
}

export async function fetchHaDiagnostic(): Promise<any> {
  return apiFetch('/api/ha/diagnostic');
}

export async function runHaDiagnostic(): Promise<any> {
  return apiFetch('/api/ha/diagnostic/run', { method: 'POST' });
}

export async function syncHa(): Promise<any> {
  return apiFetch('/api/ha/sync', { method: 'POST' });
}

export async function discoverHa(): Promise<any> {
  return apiFetch('/api/ha/discover', { method: 'POST' });
}

export async function updateHaConfig(config: { haUrl?: string; accessToken?: string; mode?: string }): Promise<any> {
  return apiFetch('/api/ha/config', {
    method: 'POST',
    body: JSON.stringify(config)
  });
}

export async function callHaService(entity_id: string, service: string, params: Record<string, any> = {}): Promise<any> {
  return apiFetch('/api/ha/service-call', {
    method: 'POST',
    body: JSON.stringify({ entity_id, service, params })
  });
}

export async function toggleHaEntity(entity: HardwareEntity): Promise<any> {
  const isCurrentlyOn = entity.state === 'on' || entity.state === 'cool' || entity.state === 'unlocked' || entity.state === 'streaming';
  let service = isCurrentlyOn ? 'turn_off' : 'turn_on';

  if (entity.domain === 'lock') {
    service = entity.state === 'locked' ? 'unlock' : 'lock';
  } else if (entity.domain === 'cover') {
    service = entity.state === 'open' ? 'close_cover' : 'open_cover';
  }

  return callHaService(entity.entity_id, service, {});
}

// ==========================================
// GEMINI MULTI-KEY MANAGEMENT CLIENT
// ==========================================

export async function fetchGeminiKeys(): Promise<{
  success: boolean;
  keys: Array<{
    key_id: string;
    masked_key: string;
    label: string;
    active: boolean;
    status: string;
    last_used: string;
    request_count: number;
    error_count: number;
    avg_latency_ms: number;
  }>;
}> {
  return apiFetch('/api/gemini/keys');
}

export async function addGeminiKey(api_key: string, label: string = 'Custom API Key'): Promise<any> {
  return apiFetch('/api/gemini/keys', {
    method: 'POST',
    body: JSON.stringify({ api_key, label })
  });
}

export async function toggleGeminiKey(key_id: string): Promise<any> {
  return apiFetch(`/api/gemini/keys/${key_id}/toggle`, {
    method: 'POST'
  });
}

export async function deleteGeminiKey(key_id: string): Promise<any> {
  return apiFetch(`/api/gemini/keys/${key_id}`, {
    method: 'DELETE'
  });
}

export async function testGeminiKey(params: { key_id?: string; raw_key?: string }): Promise<any> {
  return apiFetch('/api/gemini/test-key', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      api_key: params.raw_key,
      key: params.raw_key
    })
  });
}

// ==========================================
// AUTOMATION RULES CLIENT
// ==========================================

export async function fetchRules(): Promise<{ success: boolean; rules: AutomationRule[] }> {
  return apiFetch('/api/rules');
}

export async function saveRule(rule: AutomationRule): Promise<{ success: boolean; rule: AutomationRule }> {
  return apiFetch('/api/rules', {
    method: 'POST',
    body: JSON.stringify(rule)
  });
}

export async function deleteRule(ruleId: string): Promise<any> {
  return apiFetch(`/api/rules/${ruleId}`, {
    method: 'DELETE'
  });
}

export async function toggleRule(ruleId: string, enabled: boolean): Promise<any> {
  return apiFetch(`/api/rules/${ruleId}`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled })
  });
}
