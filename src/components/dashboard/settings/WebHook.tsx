import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Webhook, AlertCircle, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useWebhook } from '@/hooks/environments/useWebhook'
import { useEnvironments } from '@/hooks/environments/useEnvironments'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EnvironmentType } from '@/types/environments'
import type { WebHookProps } from '@/types/webhook'

const WebHook = ({ businessId }: WebHookProps) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentType>('test')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState(false)

  const { environments, isLoading: environmentsLoading, error: environmentsError, } = useEnvironments({ businessId })
  
  // Get the environment ID for the selected environment type
  const currentEnvironment = environments.find((env) => env.type === selectedEnvironment)
  const environmentId = currentEnvironment?.id || ''

  const {
    webhookConfig,
    isLoading: webhookLoading,
    error: webhookError,
    updateWebhookUrl,
    sendTestWebhook,
  } = useWebhook({ environmentId })

  // Update local state when webhook config is fetched
  useEffect(() => {
    if (webhookConfig?.webhookUrl) {
      setWebhookUrl(webhookConfig.webhookUrl)
    } else {
      setWebhookUrl('')
    }
  }, [webhookConfig, selectedEnvironment])

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL')
      return
    }

    const trimmedWebhookUrl = webhookUrl.trim()

    updateWebhookUrl.mutate(
      { webhookUrl: trimmedWebhookUrl },
      {
        onSuccess: () => {
          toast.success('Webhook URL updated successfully')
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update webhook URL')
        },
      }
    )
  }

  const handleTestWebhook = () => {
    if (!webhookConfig?.webhookUrl) {
      toast.error('Please save a webhook URL first')
      return
    }

    sendTestWebhook.mutate(undefined, {
      onSuccess: () => {
        toast.success('Test webhook sent successfully')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to send test webhook')
      },
    })
  }

  const handleCopySecret = async () => {
    if (!webhookConfig?.webhookSecret) return

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error('Clipboard not available in this environment')
      return
    }

    try {
      await navigator.clipboard.writeText(webhookConfig.webhookSecret)
      setCopied(true)
      toast.success('Webhook secret copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy webhook secret')
    }
  }

  const getWebhookSecretDisplay = () => {
   if (!webhookConfig?.webhookSecret) return 'No secret generated yet'
   return showSecret ? webhookConfig.webhookSecret : '••••••••••••••••••••••••••••'
  }

  const isLoading = environmentsLoading || webhookLoading

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            <CardTitle>Webhook Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure webhook endpoints to receive real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Selector */}
          <div className="space-y-2">
            <Label htmlFor="environment">Environment</Label>
            <Select
              value={selectedEnvironment}
              onValueChange={(value) => setSelectedEnvironment(value as EnvironmentType)}
            >
              <SelectTrigger id="environment">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show loading state */}
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading webhook configuration...</p>
            </div>
          )}

          {environmentsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{environmentsError.message}</AlertDescription>
            </Alert>
          )}

          {/* Show error if environment doesn't exist */}
          {!isLoading && !environmentsError && !currentEnvironment && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No {selectedEnvironment} environment found. Please create one in the API Keys tab first.
              </AlertDescription>
            </Alert>
          )}

          {/* Show webhook error */}
          {webhookError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{webhookError.message}</AlertDescription>
            </Alert>
          )}

          {/* Webhook configuration - only show if environment exists */}
          {!isLoading && currentEnvironment && !webhookError && (
            <>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/webhooks"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  disabled={updateWebhookUrl.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  This endpoint will receive POST requests for all transaction events
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-secret"
                    value={getWebhookSecretDisplay()}
                    readOnly
                    className="font-mono text-sm bg-secondary"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={showSecret ? 'Hide webhook secret' : 'Show webhook secret'}
                    onClick={() => setShowSecret(!showSecret)}
                    disabled={!webhookConfig?.webhookSecret}
                  >
                    {showSecret ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Copy webhook secret"
                    onClick={handleCopySecret}
                    disabled={!webhookConfig?.webhookSecret}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this secret to verify webhook signatures
                </p>
              </div>

              <Button
                onClick={handleSaveWebhook}
                disabled={updateWebhookUrl.isPending}
                className="bg-primary hover:bg-primary-hover"
              >
                {updateWebhookUrl.isPending ? 'Saving...' : 'Save Webhook Settings'}
              </Button>

              <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Test Webhook</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Send a test event to your webhook endpoint
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestWebhook}
                  disabled={sendTestWebhook.isPending || updateWebhookUrl.isPending || !webhookConfig?.webhookUrl}
                >
                  {sendTestWebhook.isPending ? 'Sending...' : 'Send Test Event'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default WebHook
