const devUrl = import.meta.env.VITE_BACKEND_DEV_URL
const prodUrl = import.meta.env.VITE_BACKEND_PROD_URL

if (!devUrl && import.meta.env.DEV) {
  throw new Error(
    'VITE_BACKEND_DEV_URL environment variable is required in development',
  )
}

if (!prodUrl && !import.meta.env.DEV) {
  throw new Error(
    'VITE_BACKEND_PROD_URL environment variable is required in production',
  )
}

export const API_URL = import.meta.env.DEV ? devUrl : prodUrl
