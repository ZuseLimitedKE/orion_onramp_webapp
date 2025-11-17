import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { sendVerificationEmail } from '@/integrations/auth/auth-client'
import { Spinner } from './ui/spinner'
import { toast } from 'sonner'
import { Mail, CheckCircle } from 'lucide-react'
import type { Resolver } from 'react-hook-form'
const resendSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

type ResendFormData = z.infer<typeof resendSchema>

interface ResendVerificationFormProps extends React.ComponentProps<'form'> {
  onBackToLogin?: () => void
}

export function ResendVerificationForm({
  className,
  onBackToLogin,
  ...props
}: ResendVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: (
      zodResolver as unknown as (schema: unknown) => Resolver<ResendFormData>
    )(resendSchema),
  })

  const onSubmit = async (data: ResendFormData) => {
    setIsLoading(true)
    setEmailSent(false)

    try {
      const { error } = await sendVerificationEmail({
        email: data.email,
      })

      if (error) {
        console.error('Verification email error:', error)
        toast.error(error.message || 'Failed to send verification email')
        return
      }

      setEmailSent(true)
      toast.success('Verification email sent! Check your inbox.')
    } catch (error) {
      console.error('Failed to send verification email:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn('flex flex-col gap-4', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold">Resend Verification Email</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email address and we'll send you a new verification link
          </p>
        </div>

        {emailSent && (
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Verification email sent!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Check your inbox and click the verification link. Don't forget
                to check your spam folder.
              </p>
            </div>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold"
          >
            {isLoading ? <Spinner /> : 'Send Verification Email'}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="underline cursor-pointer underline-offset-4 hover:opacity-70 font-medium"
            >
              Back to sign in
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
