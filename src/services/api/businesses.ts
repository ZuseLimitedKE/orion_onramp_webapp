import { Api } from '../api'
import type {
  BusinessListResponse,
  BusinessResponse,
  BusinessUser,
  CancelInvitationResponse,
  CreateBusinessFormData,
  CreateBusinessResponse,
  IndustriesResponse,
  Invitation,
  InvitationsResponse,
  InviteResponse,
  InviteUserFormData,
  RemoveTeamMemberResponse,
  SubmitBusinessFormData,
  TeamMembersResponse,
  UpdateBusinessFormData,
} from '@/types/businesses'

// helper function to remove undefined and null values from object
// ensures we don't send empty fields that would violate unique constraints
const removeUndefinedFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
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

  /**
   * List all invitations for a business
   */
  listInvitations: (businessId: string): Promise<InvitationsResponse> =>
    Api.get(`/api/business/${businessId}/invitations`),

  /**
   * Cancel an invitation
   */
  cancelInvitation: (inviteId: string): Promise<CancelInvitationResponse> =>
    Api.delete(`/api/business/invitations/${inviteId}`),

  /**
   * Get all team members for a business
   */
  getTeamMembers: (businessId: string): Promise<TeamMembersResponse> =>
    Api.get(`/api/business/${businessId}/team`),

  /**
   * Remove a team member from a business
   */
  removeTeamMember: (
    businessId: string,
    memberId: string,
  ): Promise<RemoveTeamMemberResponse> =>
    Api.delete(`/api/business/${businessId}/team/${memberId}`),

  getIndustries: (): Promise<IndustriesResponse> =>
    Api.get('/api/business/industries'),
}

export default businessApi
