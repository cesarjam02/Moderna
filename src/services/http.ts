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

  try {
    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: method !== 'GET' ? requestBody : undefined,
    });
    
    if (!res.ok) {
      // Intentar obtener el mensaje de error del cuerpo de la respuesta
      let errorMessage = `HTTP ${res.status} - ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }
    
    return res.json() as Promise<T>;
  } catch (error) {
    // Capturar errores de red (failed to fetch, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `No se pudo conectar con el servidor. Verifica que:\n` +
        `1. El servidor backend esté corriendo\n` +
        `2. La URL de la API sea correcta (${url})\n` +
        `3. No haya problemas de CORS`
      );
    }
    // Re-lanzar otros errores
    throw error;
  }
}