export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  // Por defecto usa mocks si no se especifica la variable de entorno
  // Esto permite que la app funcione sin backend
  USE_MOCKS: (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true'
};