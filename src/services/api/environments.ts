import { Api } from '../api'
import type { 
  EnvironmentType, 
  CreateEnvironmentResponse, 
  RotateKeysResponse, 
  BackendEnvironment 
} from '@/types/environments'

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
}

export default environmentsApi