import { Api } from '../api'
import type {
  BusinessListResponse,
  BusinessResponse,
  CreateBusinessFormData,
  CreateBusinessResponse,
  IndustriesResponse,
  InviteResponse,
  InviteUserFormData,
  SubmitBusinessFormData,
  UpdateBusinessFormData,
} from '@/types/businesses'

// helper function to remove undefined values from object
// this ensures we don't send empty fields that would violate unique constraints
const removeUndefinedFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>
}

const businessApi = {
  createDraft: (
    data: CreateBusinessFormData,
  ): Promise<CreateBusinessResponse> => 
    Api.post('/api/business/create', removeUndefinedFields(data)),

  updateBusiness: (
    id: string,
    data: UpdateBusinessFormData,
  ): Promise<{ message: string }> => 
    Api.put(`/api/business/${id}`, removeUndefinedFields(data)),

  submitForApproval: (
    id: string,
    data: SubmitBusinessFormData,
  ): Promise<{ message: string }> =>
    Api.put(`/api/business/submit/${id}`, removeUndefinedFields(data)),

  getUserBusinesses: (): Promise<BusinessListResponse> =>
    Api.get('/api/business/user'),

  getBusinessById: (id: string): Promise<BusinessResponse> =>
    Api.get(`/api/business/one/${id}`),

  deleteBusiness: (id: string): Promise<{ message: string }> =>
    Api.delete(`/api/business/${id}`),

  inviteUser: (
    businessId: string,
    data: InviteUserFormData,
  ): Promise<InviteResponse> =>
    Api.post(`/api/business/${businessId}/invite`, data),

  acceptInvitation: (inviteId: string): Promise<{ message: string }> =>
    Api.post(`/api/business/invitations/${inviteId}/accept`),

  getIndustries: (): Promise<IndustriesResponse> =>
    Api.get('/api/business/industries'),
}

export default businessApi
