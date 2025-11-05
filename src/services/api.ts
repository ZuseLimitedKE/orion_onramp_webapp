import { API_URL } from '@/constants/api-url'

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
export class MyError extends Error {
  code?: string
  statusCode?: number
  details?: any
  constructor(
    message: string,
    options?: { code?: string; statusCode?: number; details?: any },
  ) {
    super(message)
    this.message = message
    if (options && typeof options === 'object') {
      ; (this as any).code = options.code
        ; (this as any).statusCode = options.statusCode
        ; (this as any).details = options.details
    }
    this.name = 'MyError'
  }
}
const Api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

Api.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  (err: AxiosError) => {
    const apierror = handleAxiosError(err)
    return Promise.reject(apierror)
  },
)
function handleAxiosError(error: AxiosError): MyError {
  // Fallback error
  const apiError = new MyError('An unknown error occurred', { statusCode: 0 })
  // If the request made it to the server and got a response
  if (error.response) {
    apiError.statusCode = error.response.status || 0

    // Cast the response data to 'any' because server error shapes can vary
    const data = error.response.data as any

    if (data) {
      if (data.message) {
        apiError.message = data.message
      }
      if (data.detail) {
        apiError.details = data.detail
      }
    }
  } else {
    // If no response, it's likely a network or config error
    apiError.message = error.message || apiError.message
  }

  return apiError
}
export { Api }
