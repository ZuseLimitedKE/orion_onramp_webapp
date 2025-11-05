const devUrl = import.meta.env.VITE_BACKEND_DEV_URL

if (!devUrl && import.meta.env.DEV) {
  throw new Error(
    'VITE_BACKEND_DEV_URL environment variable is required in development',
  )
}

export const API_URL = devUrl
