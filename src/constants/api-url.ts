const backendUrl = import.meta.env.VITE_BACKEND_URL

if (!backendUrl) {
  throw new Error('BACKEND_URL environment variable is required in development')
}

export const API_URL = backendUrl
