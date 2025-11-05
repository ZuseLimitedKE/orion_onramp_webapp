import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SignupForm } from '@/components/signup-form'
import { LoginForm } from '@/components/login-form'
import { getSession } from '@/integrations/auth/auth-client'
import { redirect } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async () => {
    const session = await getSession()
    if (session.data) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

function App() {
  const [isLoginMode, setIsLoginMode] = useState(false)
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo */}
        <Logo />

        {/* Toggle Buttons */}
        <div className="inline-flex gap-1 rounded-lg bg-muted p-1 w-fit mt-2 md:ml-0 mx-auto md:mx-0">
          <button
            onClick={() => setIsLoginMode(false)}
            className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${!isLoginMode
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLoginMode(true)}
            className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${isLoginMode
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Login
          </button>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLoginMode ? (
              <LoginForm onToggleToSignup={() => setIsLoginMode(false)} />
            ) : (
              <SignupForm onToggleToLogin={() => setIsLoginMode(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/orion-hero.jpg"
          alt="Hero Section Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
