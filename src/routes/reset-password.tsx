import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getSession, resetPassword } from '@/integrations/auth/auth-client'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { PasswordInput } from '@/components/password-input'
import { Spinner } from '@/components/ui/spinner'
import type { Resolver } from 'react-hook-form'

type ResetPasswordSearch = {
  token?: string
  error?: string
}

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => {
    return {
      token: search.token as string | undefined,
      error: search.error as string | undefined,
    }
  },
  beforeLoad: async ({ search }) => {
    // If there's an error but no token, redirect away (manual URL tampering)
    if (search.error && !search.token) {
      throw redirect({ to: '/' })
    }

    // If no token at all, redirect to login (they shouldn't be here)
    if (!search.token && !search.error) {
      throw redirect({ to: '/' })
    }

    const session = await getSession()
    if (session?.data) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

function ResetPassword() {
  const navigate = useNavigate()
  const { token, error } = Route.useSearch()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ResetPasswordForm>({
    resolver: (
      zodResolver as unknown as (schema: unknown) => Resolver<ResetPasswordForm>
    )(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Invalid reset link')
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword({
        newPassword: data.newPassword,
        token,
      })

      if (result.error) {
        toast.error(result.error.message || 'Failed to reset password')
        return
      }

      setIsSuccess(true)
      toast.success('Password reset successfully!')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate({ to: '/' })
      }, 2000)
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Invalid reset link
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {error === 'invalid_token'
                ? 'This password reset link is invalid or has expired.'
                : 'Something went wrong. Please request a new password reset link.'}
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

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Password reset!
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>
          </div>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground animate-pulse">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Reset your password
          </h1>
          <p className="text-base text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* New Password */}
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <PasswordInput
                id="newPassword"
                placeholder="Enter your new password"
                {...form.register('newPassword')}
                error={form.formState.errors.newPassword?.message}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your new password"
                {...form.register('confirmPassword')}
                error={form.formState.errors.confirmPassword?.message}
              />
            </Field>

            {/* Submit Button */}
            <Field>
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : 'Reset Password'}
              </Button>
            </Field>
          </FieldGroup>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  )
}
