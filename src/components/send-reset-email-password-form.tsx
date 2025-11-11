import type React from 'react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { Spinner } from './ui/spinner'
import { ArrowLeft } from 'lucide-react'
import { requestPasswordReset } from '@/integrations/auth/auth-client'

const resetPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface SendResetPasswordEmailFormProps extends React.ComponentProps<'form'> {
  onGoBack?: () => void
}

export function SendResetPasswordEmailForm({
  className,
  onGoBack,
  ...props
}: SendResetPasswordEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: (
      zodResolver as unknown as (
        schema: unknown,
      ) => Resolver<ResetPasswordFormData>
    )(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    try {
      const { error } = await requestPasswordReset(
        {
          email: data.email,
        },
        {
          onSuccess() {
            toast.success(
              'Password reset link sent to your email. Please check your inbox.',
            )
            reset()
            setTimeout(() => onGoBack?.(), 2000)
          },
        },
      )
      if (error) {
        console.error(error)
        toast.error(error.message)
        return
      }
    } catch (error) {
      console.error('Password reset failed:', error)
      toast.error('Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn('flex flex-col gap-3', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-extrabold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="reset-email">Email</FieldLabel>
          <Input
            id="reset-email"
            type="email"
            placeholder="m@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        {/* Submit Button */}
        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold"
          >
            {isLoading ? <Spinner /> : 'Send Reset Link'}
          </Button>
        </Field>

        {/* Back Button */}
        <Field>
          <button
            type="button"
            onClick={onGoBack}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </Field>
      </FieldGroup>
    </form>
  )
}
