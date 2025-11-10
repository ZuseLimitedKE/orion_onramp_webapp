import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Copy, CheckCircle2 } from 'lucide-react'
import type { KeysRevealDialogProps } from '@/types/environments'
import { toast } from 'sonner'

export default function KeysRevealDialog({
  open,
  onOpenChange,
  environmentType,
  publicKey,
  privateKey,
  isRotation = false,
}: KeysRevealDialogProps) {
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedPrivate, setCopiedPrivate] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)

  const handleCopy = (text: string, type: 'public' | 'private') => {
    navigator.clipboard.writeText(text)
    toast.success(`${type === 'public' ? 'Public' : 'Private'} key copied!`)

    if (type === 'public') {
      setCopiedPublic(true)
      setTimeout(() => setCopiedPublic(false), 2000)
    } else {
      setCopiedPrivate(true)
      setTimeout(() => setCopiedPrivate(false), 2000)
    }
  }

  const handleClose = () => {
    if (!hasConfirmed) {
      const confirmed = window.confirm(
        'Are you sure you want to close? You will not be able to see the full private key again.',
      )
      if (confirmed) {
        setHasConfirmed(false)
        onOpenChange(false)
      }
    } else {
      setHasConfirmed(false)
      onOpenChange(false)
    }
  }

  const handleConfirmAndClose = () => {
    setHasConfirmed(true)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isRotation ? 'New API Keys Generated' : 'Environment Created Successfully'}
          </DialogTitle>
          <DialogDescription>
            {isRotation
              ? `Your ${environmentType} environment keys have been rotated.`
              : `Your ${environmentType} environment has been created.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Critical Warning Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Save Your Keys Now!
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This is the <strong>only time</strong> you'll see your full private key.
                  After you close this dialog, the private key will be masked for security.
                  Make sure to copy and store it in a secure location.
                </p>
              </div>
            </div>
          </div>

          {/* Public Key */}
          <div className="space-y-2">
            <Label htmlFor="revealed-public-key" className="text-base font-semibold">
              Public Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="revealed-public-key"
                value={publicKey}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(publicKey, 'public')}
                className="shrink-0"
              >
                {copiedPublic ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Safe to use in client-side applications
            </p>
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <Label htmlFor="revealed-private-key" className="text-base font-semibold">
              Private Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="revealed-private-key"
                value={privateKey}
                readOnly
                className="font-mono text-sm bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(privateKey, 'private')}
                className="shrink-0"
              >
                {copiedPrivate ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              ⚠️ Keep this secret! Only use in server-side code.
            </p>
          </div>

          {/* Security Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Security Best Practices:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
              <li>Store your private key in environment variables or a secure vault</li>
              <li>Never commit private keys to version control (Git, etc.)</li>
              <li>Never expose private keys in client-side code or public repositories</li>
              <li>Rotate keys immediately if you suspect they've been compromised</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAndClose} className="bg-green-600 hover:bg-green-700">
              I've Saved My Keys
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
