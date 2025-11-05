import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Webhook } from 'lucide-react'
import { toast } from 'sonner'

const WebHook = () => {
  const [webhookUrl, setWebhookUrl] = useState(
    'https://api.acmecorp.com/webhooks',
  )
  const [showSecret, setShowSecret] = useState(false)
  const handleSaveWebhook = () => {
    toast.success('Webhook settings saved successfully')
  }

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
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-domain.com/webhooks"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This endpoint will receive POST requests for all transaction
              events
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Webhook Secret</Label>
            <div className='flex gap-2'>
              <Input
                id="webhook-secret"
                value={showSecret ? "whsec_1234567890abcdefghijklmnop" : "••••••••••••••••••••••••••••"}
                readOnly
                className="font-mono text-sm bg-secondary"
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
              >
              {showSecret ? 'Hide' : 'Show'}
            </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this secret to verify webhook signatures
            </p>
          </div>

          <Button
            onClick={handleSaveWebhook}
            className="bg-primary hover:bg-primary-hover"
          >
            Save Webhook Settings
          </Button>

          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">
              Test Webhook
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Send a test event to your webhook endpoint
            </p>
            <Button variant="outline" size="sm">
              Send Test Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default WebHook
