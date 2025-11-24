import { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import EnvironmentCard from './EnvironmentCard'
import KeysRevealDialog from './KeysRevealDialog'
import { useEnvironments } from '@/hooks/environments/useEnvironments'
import { MyError } from '@/services/api'
import type {
  EnvironmentType,
  EnvironmentData,
  BackendEnvironment,
} from '@/types/environments'
import { BUSINESS_STATUS } from '@/types/businesses'
import { toast } from 'sonner'

interface EnvironmentsProps {
  businessId: string
  businessStatus: BUSINESS_STATUS
}

export default function Environments({ businessId, businessStatus }: EnvironmentsProps) {
  const { environments, isLoading, createEnvironment, rotateKeys } = useEnvironments({ businessId })
  
  const isBusinessApproved = businessStatus === BUSINESS_STATUS.APPROVED

  // State for environment data
  const [testEnvironment, setTestEnvironment] = useState<EnvironmentData>({
    type: 'test',
    status: 'not-created',
  })

  const [liveEnvironment, setLiveEnvironment] = useState<EnvironmentData>({
    type: 'live',
    status: 'not-created',
  })

  // State for showing/hiding keys
  const [showTestPrivateKey, setShowTestPrivateKey] = useState(false)
  const [showLivePrivateKey, setShowLivePrivateKey] = useState(false)

  // State for tracking which environment is being created/rotated
  const [creatingType, setCreatingType] = useState<EnvironmentType | null>(null)
  const [rotatingType, setRotatingType] = useState<EnvironmentType | null>(null)

  // State for the keys reveal dialog
  const [revealDialog, setRevealDialog] = useState<{
    open: boolean
    type: EnvironmentType
    publicKey: string
    privateKey: string
    isRotation: boolean
  }>({
    open: false,
    type: 'test',
    publicKey: '',
    privateKey: '',
    isRotation: false,
  })

  useEffect(() => {
    if (environments && environments.length > 0) {
      environments.forEach((env: BackendEnvironment) => {
        const envData: EnvironmentData = {
          type: env.type,
          status: 'active',
          id: env.id,
          publicKey: env.publicKey,
          privateKeyPreview: env.privateKeyPreview,
          createdAt: env.createdAt,
        }

        if (env.type === 'test') {
          setTestEnvironment(envData)
        } else if (env.type === 'live') {
          setLiveEnvironment(envData)
        }
      })
    }
  }, [environments])

  const handleCreateEnvironment = async (type: EnvironmentType) => {
    setCreatingType(type)
    try {
      const response = await createEnvironment.mutateAsync({
        type,
        businessID: businessId,
      })
      const { environment } = response

      const newEnvironment: EnvironmentData = {
        type,
        status: 'active',
        id: environment.id,
        publicKey: environment.publicKey,
        privateKeyPreview: '***' + environment.privateKey.slice(-6), // backend won't return full key in future fetches
        createdAt: new Date().toISOString(),
      }

      if (type === 'test') {
        setTestEnvironment(newEnvironment)
      } else {
        setLiveEnvironment(newEnvironment)
      }

      // Show the keys in a dialog
      setRevealDialog({
        open: true,
        type,
        publicKey: environment.publicKey,
        privateKey: environment.privateKey,
        isRotation: false,
      })

      toast.success('Environment created successfully!')
    } catch (error) {
      const apiError = error as MyError
      toast.error(`Failed to create environment`)
      console.error('Failed to create environment:', apiError.message)
    } finally {
      setCreatingType(null)
    }
  }

  const handleRotateKeys = async (type: EnvironmentType) => {
    setRotatingType(type)
    try {
      const response = await rotateKeys.mutateAsync({
        type,
        businessID: businessId,
      })

      // Update local state with preview (backend won't return full key again)
      const updatedData = {
        publicKey: response.publicKey,
        privateKeyPreview: '***' + response.privateKey.slice(-6),
      }

      if (type === 'test' && testEnvironment.status === 'active') {
        setTestEnvironment({ ...testEnvironment, ...updatedData })
      } else if (type === 'live' && liveEnvironment.status === 'active') {
        setLiveEnvironment({ ...liveEnvironment, ...updatedData })
      }

      // Show the new keys in a dialog
      setRevealDialog({
        open: true,
        type,
        publicKey: response.publicKey,
        privateKey: response.privateKey,
        isRotation: true,
      })

      toast.success('Keys rotated successfully!')
    } catch (error) {
      const apiError = error as MyError
      console.error('Failed to rotate keys:', apiError.message)
      toast.error('Failed to rotate keys')
    } finally {
      setRotatingType(null)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
      console.log(`${label} copied to clipboard`)
    } catch (error) {
      toast.error(`Failed to copy ${label}`)
      console.error(`Failed to copy ${label}:`, error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">API Environments</h2>
        <p className="text-muted-foreground mt-1">
          Manage your API keys for test and live environments
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading environments...</p>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Important: Keep your keys secure
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Your private keys will only be shown once after creation or
                rotation. Make sure to save them in a secure location.
              </p>
            </div>
          </div>

          {/* Test Environment */}
          <EnvironmentCard
            title="Test Environment"
            description="Use test environment for development and testing. No real transactions will be processed."
            environment={testEnvironment}
            showPrivateKey={showTestPrivateKey}
            isCreating={creatingType === 'test'}
            isRotating={rotatingType === 'test'}
            onTogglePrivateKey={() =>
              setShowTestPrivateKey(!showTestPrivateKey)
            }
            onCreate={() => handleCreateEnvironment('test')}
            onRotate={() => handleRotateKeys('test')}
            onCopy={copyToClipboard}
            badgeVariant="secondary"
            isBusinessApproved={true}
          />

          <Separator />

          {/* Live Environment */}
          <EnvironmentCard
            title="Live Environment"
            description="Use live environment for production. Real transactions will be processed."
            environment={liveEnvironment}
            showPrivateKey={showLivePrivateKey}
            isCreating={creatingType === 'live'}
            isRotating={rotatingType === 'live'}
            onTogglePrivateKey={() =>
              setShowLivePrivateKey(!showLivePrivateKey)
            }
            onCreate={() => handleCreateEnvironment('live')}
            onRotate={() => handleRotateKeys('live')}
            onCopy={copyToClipboard}
            badgeVariant="destructive"
            isBusinessApproved={isBusinessApproved}
            businessStatus={businessStatus}
          />
        </>
      )}

      {/* Keys Reveal Dialog */}
      <KeysRevealDialog
        open={revealDialog.open}
        onOpenChange={(open) => setRevealDialog({ ...revealDialog, open })}
        environmentType={revealDialog.type}
        publicKey={revealDialog.publicKey}
        privateKey={revealDialog.privateKey}
        isRotation={revealDialog.isRotation}
      />
    </div>
  )
}
