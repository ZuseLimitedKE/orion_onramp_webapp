import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { EnvironmentCardProps } from '@/types/environments'
import { Eye, EyeOff, Copy, CheckCircle2, AlertCircle } from 'lucide-react'

export default function EnvironmentCard({
  title,
  description,
  environment,
  showPrivateKey,
  isCreating,
  isRotating,
  onTogglePrivateKey,
  onCreate,
  onRotate,
  onCopy,
  isBusinessApproved,
  businessStatus,
}: EnvironmentCardProps) {
  const isActive = environment.status === 'active'
  const isLiveEnvironment = environment.type === 'live'
  const canCreateLive = isBusinessApproved || !isLiveEnvironment
  const displayStatus = businessStatus ?? 'Pending review'

  return (
    <Card className="p-6">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            {isActive ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="outline">Not Created</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Not Created State */}
      {!isActive && (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          {isLiveEnvironment && !isBusinessApproved && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2 text-left">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 dark:text-amber-100">
                    Business Approval Required
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    Your business must be approved before you can create a live environment. Current status: <span className="font-semibold">{displayStatus}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={onCreate} 
            disabled={isCreating || !canCreateLive}
          >
            {isCreating ? 'Creating...' : `Create ${title}`}
          </Button>
        </div>
      )}

      {/* Active State - Show Keys */}
      {isActive && (
        <div className="space-y-4">
          {/* Public Key */}
          <div className="space-y-2">
            <Label htmlFor={`${environment.type}-public-key`}>Public Key</Label>
            <div className="flex gap-2">
              <Input
                id={`${environment.type}-public-key`}
                value={environment.publicKey}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopy(environment.publicKey!, 'Public key')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this key in your client-side code
            </p>
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <Label htmlFor={`${environment.type}-private-key`}>
              Private Key (Masked)
            </Label>
            <div className="flex gap-2">
              <Input
                id={`${environment.type}-private-key`}
                type={showPrivateKey ? 'text' : 'password'}
                value={
                  environment.status === 'active'
                    ? environment.privateKeyPreview
                    : ''
                }
                readOnly
                className="font-mono text-sm bg-muted"
                disabled
              />
              <Button
                variant="outline"
                size="icon"
                onClick={onTogglePrivateKey}
              >
                {showPrivateKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              For security, the full private key is only shown once during
              creation/rotation. This is a masked preview.
            </p>
          </div>

          {/* Created At */}
          {environment.createdAt && (
            <p className="text-xs text-muted-foreground">
              Created on{' '}
              {(() => {
                const date = new Date(environment.createdAt!)
                return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString()
              })()}
            </p>
          )}

          {/* Rotate Keys Button */}
          <div className="pt-4 border-t">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm mb-1">Rotate API Keys</h4>
                <p className="text-xs text-muted-foreground">
                  Generate new keys and invalidate the old ones. Use this if
                  your keys have been compromised.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onRotate}
                disabled={isRotating}
                className="ml-4 cursor-pointer"
              >
                {isRotating ? 'Rotating...' : 'Rotate Keys'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
