import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export function PasswordInput({
  error,
  label,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'pr-10',
            error
              ? 'border-destructive text-destructive focus-visible:ring-destructive'
              : '',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
