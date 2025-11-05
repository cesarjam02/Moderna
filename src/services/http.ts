export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const isFormData = body instanceof FormData;

  // NOTE: Do not stringify body or set Content-Type if it's FormData
  const requestBody = isFormData ? (body as FormData) : JSON.stringify(body);
  
  const requestHeaders = isFormData
    ? headers // Let the browser set Content-Type for FormData
    : {
        'Content-Type': 'application/json',
        ...headers,
      };

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body: method !== 'GET' ? requestBody : undefined,
  });
  
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return res.json() as Promise<T>;
}