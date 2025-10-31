export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  USE_MOCKS: (import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true'
};