import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { API_URL } from '@/constants/api-url'
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        businessName: {
          type: 'string',
          required: true,
        },
        phoneNumber: {
          type: 'string',
          required: true,
        },
        country: {
          type: 'string',
          required: false, // optional for now
          defaultValue: 'Kenya',
          input: false, // don't allow country selection for now.
        },
      },
    }),
  ],
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: API_URL,
})

export const {
  signIn,
  signUp,
  useSession,
  getSession,
  signOut,
  sendVerificationEmail,
} = authClient
