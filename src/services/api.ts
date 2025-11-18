import { API_URL } from '@/constants/api-url'
import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

export class MyError extends Error {
  statusCode?: number
  cause?: unknown

  constructor(
    message: string,
    options?: { statusCode?: number; cause?: unknown },
  ) {
    super(message)
    this.name = 'MyError'
    this.statusCode = options?.statusCode
    this.cause = options?.cause
  }
}

// Type for backend error response
interface BackendErrorResponse {
  message: string
  success?: boolean
}

const Api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

Api.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  (err: AxiosError<BackendErrorResponse>) => {
    const apiError = handleAxiosError(err)
    return Promise.reject(apiError)
  },
)

function handleAxiosError(error: AxiosError<BackendErrorResponse>): MyError {
  // Network or request setup error
  if (!error.response) {
    return new MyError(error.message || 'Network error occurred', {
      statusCode: 0,
      cause: error,
    })
  }

  const { status, data } = error.response

  // Backend returns { message: string } for MyError instances
  const message = data?.message || 'An unknown error occurred'

  return new MyError(message, {
    statusCode: status,
    cause: error,
  })
}

export { Api }
