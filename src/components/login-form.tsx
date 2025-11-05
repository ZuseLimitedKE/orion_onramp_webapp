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
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth'
import { type Resolver } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { signIn } from '@/integrations/auth/auth-client'
import { toast } from 'sonner'
import { PasswordInput } from './password-input'
import { Spinner } from './ui/spinner'
interface LoginFormProps extends React.ComponentProps<'form'> {
  onToggleToSignup?: () => void
}

export function LoginForm({
  className,
  onToggleToSignup,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: (
      zodResolver as unknown as (schema: unknown) => Resolver<LoginFormData>
    )(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const { error } = await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess() {
            reset()
            navigate({ to: '/dashboard' })
          },
        },
      )

      if (error) {
        console.error('Login error:', error)
        toast.error(error.message)
        return
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed, please try again')
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
          <h1 className="text-xl font-extrabold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
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

        {/* Password */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <PasswordInput
            id="login-password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
        </Field>

        {/* Submit Button */}
        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold"
          >
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onToggleToSignup}
              className="underline cursor-pointer underline-offset-4 hover:opacity-70 font-medium"
            >
              Sign up
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
