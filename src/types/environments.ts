import type { BUSINESS_STATUS } from "./businesses"

export type EnvironmentType = 'test' | 'live'

export interface KeysRevealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  environmentType: EnvironmentType
  publicKey: string
  privateKey: string
  isRotation?: boolean
}

// Backend response type for environment list
export interface BackendEnvironment {
  id: string
  type: EnvironmentType
  publicKey: string
  privateKeyPreview: string
  createdAt: string
}

// Backend response for create/rotate operations
export interface EnvironmentKeysResponse {
  publicKey: string
  privateKey: string
}

export interface CreateEnvironmentResponse {
  message: string
  environment: {
    id: string
    type: EnvironmentType
    publicKey: string
    privateKey: string
  }
}

export interface RotateKeysResponse {
  message: string
  publicKey: string
  privateKey: string
}

export type EnvironmentData =
  | {
      type: EnvironmentType
      status: 'not-created'
    }
  | {
      type: EnvironmentType
      status: 'active'
      id: string
      publicKey: string
      privateKeyPreview: string
      createdAt: string
    }

export interface EnvironmentCardProps {
  title: string
  description: string
  environment: EnvironmentData
  showPrivateKey: boolean
  isCreating: boolean
  isRotating: boolean
  onTogglePrivateKey: () => void
  onCreate: () => void
  onRotate: () => void
  onCopy: (text: string, label: string) => void
  badgeVariant?: 'secondary' | 'destructive'
  isBusinessApproved: boolean
  businessStatus?: string
}

export interface EnvironmentsProps {
  businessId: string
  businessStatus: BUSINESS_STATUS
}
