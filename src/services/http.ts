export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const isFormData = body instanceof FormData;

  const requestHeaders = isFormData
    ? headers
    : {
        'Content-Type': 'application/json',
        ...headers,
      };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    if (isFormData) {
      fetchOptions.body = body as FormData;
    } else if (body != null) {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status} - ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // No hay cuerpo JSON o no se pudo parsear, se usa el mensaje de estado
      }
      throw new Error(errorMessage);
    }

    if (res.status === 204) {
      return Promise.resolve(null as T);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `No se pudo conectar con el servidor. Verifica que:\n` +
        `1. El backend esté corriendo.\n` +
        `2. La URL de VITE_API_URL (${import.meta.env.VITE_API_URL}) sea correcta.\n` +
        `3. No haya problemas de CORS.`
      );
    }
    throw error;
  }
}