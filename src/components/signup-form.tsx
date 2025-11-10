import type React from 'react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { CountrySelect } from './country-select'
import { signupSchema, type SignupFormData } from '@/lib/schemas/auth'
import { signUp } from '@/integrations/auth/auth-client'
import type { Resolver } from 'react-hook-form'
import { Spinner } from './ui/spinner'
import { toast } from 'sonner'
import { PasswordInput } from './password-input'
interface SignupFormProps extends React.ComponentProps<'form'> {
  onToggleToLogin?: () => void
}
export function SignupForm({
  className,
  onToggleToLogin,
  ...props
}: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: (
      zodResolver as unknown as (schema: unknown) => Resolver<SignupFormData>
    )(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      const { error } = await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          businessName: data.businessName,
          phoneNumber: data.phoneNumber,
        },
        {
          onSuccess() {
            reset()
            toast.success(
              'Account created.Check your email for a verification link.',
            )
          },
        },
      )
      if (error) {
        console.error(error)
        toast.error(error.message)
        return
      }
    } catch (error) {
      console.error('Signup failed:', error)
      toast.error('Sign up failed')
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
          <h1 className="text-xl font-extrabold">
            Create your Business account
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <FieldDescription className="text-red-500">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <FieldDescription>
            Must be at least 8 characters with an uppercase letter and number.
          </FieldDescription>
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <PasswordInput
            id="confirm-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </Field>

        {/* Business Name */}
        <Field>
          <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
          <Input
            id="businessName"
            type="text"
            placeholder="Your Business Ltd"
            {...register('businessName')}
            className={errors.businessName ? 'border-red-500' : ''}
          />
          {errors.businessName && (
            <FieldDescription className="text-red-500">
              {errors.businessName.message}
            </FieldDescription>
          )}
        </Field>

        {/* Phone Number */}
        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+254 115 816 456"
            {...register('phoneNumber')}
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && (
            <FieldDescription className="text-red-500">
              {errors.phoneNumber.message}
            </FieldDescription>
          )}
        </Field>

        {/* Country */}
        <Field className="hidden">
          <FieldLabel htmlFor="country">Country (Optional)</FieldLabel>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountrySelect
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          {errors.country && (
            <FieldDescription className="text-red-500">
              {errors.country.message}
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
            {isLoading ? <Spinner /> : 'Create Account'}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleToLogin}
              className="underline cursor-pointer underline-offset-4 hover:opacity-70 font-medium"
            >
              Sign in
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
