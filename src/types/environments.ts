export type EnvironmentType = 'test' | 'live'

export interface KeysRevealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  environmentType: EnvironmentType
  publicKey: string
  privateKey: string
  isRotation?: boolean
}

export type EnvironmentData =
  | {
      type: EnvironmentType
      status: 'not-created'
    }
  | {
      type: EnvironmentType
      status: 'active'
      publicKey: string
      privateKey: string
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
}