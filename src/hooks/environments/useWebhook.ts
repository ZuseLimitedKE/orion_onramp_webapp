import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import environmentsApi from '@/services/api/environments'
import { MyError } from '@/services/api'
import type { UpdateWebhookRequest } from '@/types/webhook'

interface UseWebhookProps {
  environmentId: string
}

export function useWebhook({ environmentId }: UseWebhookProps) {
  const queryClient = useQueryClient()

  const {
    data: webhookConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['webhook-config', environmentId],
    queryFn: () => environmentsApi.getWebhookConfig(environmentId),
    retry: 2,
    enabled: !!environmentId,
  })

  const updateWebhookUrl = useMutation({
    mutationFn: (data: UpdateWebhookRequest) =>
      environmentsApi.updateWebhookUrl(environmentId, data),
    onSuccess: () => {
      console.log('Webhook URL updated successfully')
      // Invalidate and refetch webhook config
      queryClient.invalidateQueries({ queryKey: ['webhook-config', environmentId] })
    },
    onError: (error: MyError) => {
      console.error('Failed to update webhook URL:', error.message)
    },
  })

  const sendTestWebhook = useMutation({
    mutationFn: () => environmentsApi.sendTestWebhook(environmentId),
    onError: (error: MyError) => {
      console.error('Failed to send test webhook:', error.message)
    },
  })

  return {
    webhookConfig,
    isLoading,
    error: error as MyError | null,
    updateWebhookUrl,
    sendTestWebhook,
  }
}
