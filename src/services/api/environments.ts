import { Api } from '../api'
import type { 
  EnvironmentType, 
  CreateEnvironmentResponse, 
  RotateKeysResponse, 
  BackendEnvironment 
} from '@/types/environments'
import type {
  WebhookConfigResponse,
  UpdateWebhookRequest,
  UpdateWebhookResponse,
  TestWebhookResponse
} from '@/types/webhook'

interface GetEnvironmentsResponse {
  environments: BackendEnvironment[]
}

const environmentsApi = {
  getEnvironments: (businessId: string): Promise<GetEnvironmentsResponse> => 
    Api.get(`/api/environment/${businessId}`),
  createEnvironment: (data: { type: EnvironmentType; businessID: string }): Promise<CreateEnvironmentResponse> =>
    Api.post('/api/environment', data),
  rotateKeys: (data: { type: EnvironmentType; businessID: string }): Promise<RotateKeysResponse> =>
    Api.post('/api/environment/new', data),
  
  // Webhook endpoints
  getWebhookConfig: (environmentId: string): Promise<WebhookConfigResponse> =>
    Api.get(`/api/environment/${environmentId}/webhook`),
  updateWebhookUrl: (environmentId: string, data: UpdateWebhookRequest): Promise<UpdateWebhookResponse> =>
    Api.put(`/api/environment/${environmentId}/webhook`, data),
  sendTestWebhook: (environmentId: string): Promise<TestWebhookResponse> =>
    Api.post(`/api/environment/${environmentId}/webhook/test`, {}),
}

export default environmentsApi