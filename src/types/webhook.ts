export interface WebhookConfig {
  webhookUrl: string | null
  webhookSecret: string
}

export interface WebHookProps {
  businessId: string
}

export interface UpdateWebhookRequest {
  webhookUrl: string
}

export interface WebhookConfigResponse {
  webhookUrl: string | null
  webhookSecret: string
}

export interface UpdateWebhookResponse {
  message: string
}

export interface TestWebhookResponse {
  message: string
}
