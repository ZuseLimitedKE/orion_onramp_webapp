import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import businessApi from '@/services/api/businesses'
import { MyError } from '@/services/api'
import type {
  CreateBusinessFormData,
  UpdateBusinessFormData,
  SubmitBusinessFormData,
  InviteUserFormData,
  BusinessType,
} from '@/types/businesses'

// Query Keys for consistent cache management
export const businessQueryKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessQueryKeys.all, 'list'] as const,
  list: (filters: string) =>
    [...businessQueryKeys.lists(), { filters }] as const,
  details: () => [...businessQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessQueryKeys.details(), id] as const,
  industries: ['industries'] as const,
}

// Hook for fetching all user businesses
export function useBusinesses() {
  const queryClient = useQueryClient()

  const {
    data: businessesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: businessQueryKeys.lists(),
    queryFn: () => businessApi.getUserBusinesses(),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createDraftMutation = useMutation({
    mutationFn: (data: CreateBusinessFormData) => businessApi.createDraft(data),
    onSuccess: (response) => {
      toast.success('Business draft created successfully!')
      // Invalidate businesses list to show the new business
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() })
      return response
    },
    onError: (error: MyError) => {
      console.error('Failed to create business:', error.message)
      toast.error(error.message || 'Failed to create business')
    },
  })

  const updateBusinessMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBusinessFormData }) =>
      businessApi.updateBusiness(id, data),
    onSuccess: (_response, variables) => {
      toast.success('Business updated successfully!')
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: businessQueryKeys.detail(variables.id),
      })
    },
    onError: (error: MyError) => {
      console.error('Failed to update business:', error.message)
      toast.error(error.message || 'Failed to update business')
    },
  })

  const submitForApprovalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitBusinessFormData }) =>
      businessApi.submitForApproval(id, data),
    onSuccess: (_response, variables) => {
      toast.success('Business submitted for approval!')
      // Invalidate both list and detail queries to reflect status change
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: businessQueryKeys.detail(variables.id),
      })
    },
    onError: (error: MyError) => {
      console.error('Failed to submit business:', error.message)
      toast.error(error.message || 'Failed to submit business for approval')
    },
  })

  const deleteBusinessMutation = useMutation({
    mutationFn: (id: string) => businessApi.deleteBusiness(id),
    onSuccess: (_response, deletedId) => {
      toast.success('Business deleted successfully!')
      // Remove from cache and invalidate list
      queryClient.removeQueries({
        queryKey: businessQueryKeys.detail(deletedId),
      })
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() })
    },
    onError: (error: MyError) => {
      console.error('Failed to delete business:', error.message)
      toast.error(error.message || 'Failed to delete business')
    },
  })

  return {
    // Data
    businesses: (businessesData?.businesses || []) as BusinessType[],
    isLoading,
    error: error as MyError | null,

    // Actions
    createDraft: createDraftMutation.mutateAsync,
    updateBusiness: updateBusinessMutation.mutateAsync,
    submitForApproval: submitForApprovalMutation.mutateAsync,
    deleteBusiness: deleteBusinessMutation.mutateAsync,
    refetch,

    // Mutation states
    isCreating: createDraftMutation.isPending,
    isUpdating: updateBusinessMutation.isPending,
    isSubmitting: submitForApprovalMutation.isPending,
    isDeleting: deleteBusinessMutation.isPending,
  }
}

// Hook for fetching a single business by ID
export function useBusiness(businessId: string | undefined) {
  const queryClient = useQueryClient()

  const {
    data: businessData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: businessQueryKeys.detail(businessId!),
    queryFn: () => businessApi.getBusinessById(businessId!),
    enabled: !!businessId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const inviteUserMutation = useMutation({
    mutationFn: (data: InviteUserFormData) =>
      businessApi.inviteUser(businessId!, data),
    onSuccess: (response, variables) => {
      toast.success(`Invitation sent to ${variables.email}!`)
      // Optionally invalidate business details to show updated team info
      queryClient.invalidateQueries({
        queryKey: businessQueryKeys.detail(businessId!),
      })
      return response
    },
    onError: (error: MyError) => {
      console.error('Failed to invite user:', error.message)
      toast.error(error.message || 'Failed to send invitation')
    },
  })

  return {
    // Data
    business: businessData?.business || null,
    isLoading,
    error: error as MyError | null,

    // Actions
    inviteUser: inviteUserMutation.mutateAsync,
    refetch,

    // Mutation states
    isInviting: inviteUserMutation.isPending,
  }
}

// Hook for accepting invitations
export function useInvitations() {
  const queryClient = useQueryClient()

  const acceptInvitationMutation = useMutation({
    mutationFn: (inviteId: string) => businessApi.acceptInvitation(inviteId),
    onSuccess: () => {
      toast.success('Invitation accepted successfully!')
      // Invalidate businesses list as user now has access to new business
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() })
    },
    onError: (error: MyError) => {
      console.error('Failed to accept invitation:', error.message)
      toast.error(error.message || 'Failed to accept invitation')
    },
  })

  return {
    acceptInvitation: acceptInvitationMutation.mutateAsync,
    isAccepting: acceptInvitationMutation.isPending,
  }
}

// Hook for fetching industries and categories
export function useIndustries() {
  const {
    data: industriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: businessQueryKeys.industries,
    queryFn: () => businessApi.getIndustries(),
    retry: 2,
    staleTime: 30 * 60 * 1000, // 30 minutes - industries don't change often
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
  })

  return {
    industries: industriesData?.industries || [],
    isLoading,
    error: error as MyError | null,
  }
}
