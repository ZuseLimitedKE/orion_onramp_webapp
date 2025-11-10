import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { getSession } from '@/integrations/auth/auth-client'

type VerifyEmailSearch = {
  error?: string
  token?: string
}

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmail,
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => {
    return {
      error: search.error as string | undefined,
      token: search.token as string | undefined,
    }
  },
  beforeLoad: async ({ search }) => {
    // If there's an error param but no token, someone is manually tampering with the URL , redirect them away since this isn't a legitimate verification attempt
    if (search.error && !search.token) {
      throw redirect({ to: '/dashboard' })
    }

    const session = await getSession()

    if (session?.data?.user?.emailVerified) {
      // User is already verified, redirect to dashboard
      throw redirect({ to: '/dashboard' })
    }
  },
})

function VerifyEmail() {
  const navigate = useNavigate()
  const { error } = Route.useSearch()

  useEffect(() => {
    if (!error) {
      const timer = setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error, navigate])

  const iconColor = error
    ? 'text-red-500 dark:text-red-400'
    : 'text-emerald-500 dark:text-emerald-400'

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <AlertCircle className={`w-16 h-16 ${iconColor}`} />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Verification failed
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {error === 'invalid_token'
                ? 'The verification link is invalid or has expired.'
                : "We couldn't verify your email. Please try again."}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate({ to: '/' })}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline underline-offset-4"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className={`w-16 h-16 ${iconColor}`} />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Email verified!
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your email has been successfully verified. You can now access your
            account.
          </p>
        </div>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground animate-pulse">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  )
}
