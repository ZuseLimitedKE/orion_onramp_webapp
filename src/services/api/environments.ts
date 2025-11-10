import { Api } from '../api'
import type { EnvironmentType } from '@/types/environments'

const environmentsApi = {
  getEnvironments: () => Api.get('/api/environment'),
  createEnvironment: (data: { type: EnvironmentType }) =>
    Api.post('/api/environment', data),
  rotateKeys: (data: { type: EnvironmentType }) =>
    Api.post('/api/environment/new', data),
}

export default environmentsApi