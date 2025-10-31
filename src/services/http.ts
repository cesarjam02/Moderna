export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { method = 'GET', body, headers } = options;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return res.json() as Promise<T>;
}