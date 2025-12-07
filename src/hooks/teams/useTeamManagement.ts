import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  BusinessUser,
  Invitation,
  InviteUserFormData,
  TeamMember,
  USER_INVITATION_STATUS,
  USER_ROLES,
} from '@/types/businesses';
import type { MyError } from '@/services/api';
import businessApi from '@/services/api/businesses';
import { useSession } from '@/integrations/auth/auth-client';

// Query keys for consistent cache management
export const teamQueryKeys = {
  all: ['team'] as const,
  business: (businessId: string) => [...teamQueryKeys.all, businessId] as const,
  invitations: (businessId: string) => 
    [...teamQueryKeys.business(businessId), 'invitations'] as const,
  members: (businessId: string) => 
    [...teamQueryKeys.business(businessId), 'members'] as const,
};

interface UseTeamManagementProps {
  businessId: string;
}

export function useTeamManagement({ businessId }: UseTeamManagementProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Query: Get team members
  const {
    data: teamMembersData,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: teamQueryKeys.members(businessId),
    queryFn: () => businessApi.getTeamMembers(businessId),
    enabled: !!businessId,
    retry: 2,
  });

  // Query: Get invitations
  const {
    data: invitationsData,
    isLoading: isLoadingInvitations,
    error: invitationsError,
    refetch: refetchInvitations,
  } = useQuery({
    queryKey: teamQueryKeys.invitations(businessId),
    queryFn: () => businessApi.listInvitations(businessId),
    enabled: !!businessId,
    retry: 2,
  });

  // Mutation: Invite user
  const inviteUserMutation = useMutation({
    mutationFn: (data: InviteUserFormData) =>
      businessApi.inviteUser(businessId, data),
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries({ 
        queryKey: teamQueryKeys.invitations(businessId) 
      });
    },
    onError: (error: MyError) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });

  // Mutation: Cancel invitation
  const cancelInvitationMutation = useMutation({
    mutationFn: (inviteId: string) =>
      businessApi.cancelInvitation(inviteId),
    onSuccess: () => {
      toast.success('Invitation cancelled');
      queryClient.invalidateQueries({ 
        queryKey: teamQueryKeys.invitations(businessId) 
      });
    },
    onError: (error: MyError) => {
      toast.error(error.message || 'Failed to cancel invitation');
    },
  });

  // Mutation: Remove team member
  const removeTeamMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      businessApi.removeTeamMember(businessId, memberId),
    onSuccess: () => {
      toast.success('Team member removed');
      queryClient.invalidateQueries({ 
        queryKey: teamQueryKeys.members(businessId) 
      });
    },
    onError: (error: MyError) => {
      toast.error(error.message || 'Failed to remove team member');
    },
  });

  // Process team members data
  const teamMembers: Array<TeamMember> = teamMembersData?.members?.map((member: BusinessUser) => ({
    id: member.id,
    userId: member.userId,
    businessId: member.businessId,
    role: member.role,
    joinedAt: member.joinedAt,
    name: member.user?.name || 'Unknown User',
    email: member.user?.email || 'No email',
    phoneNumber: member.user?.phoneNumber,
    businessName: member.user?.businessName,
    isOwner: false, // We'll determine this separately
  })) || [];

  const invitations: Array<Invitation> = invitationsData?.invitations || [];

  // Determine if current user is owner (you might need to fetch this from business data)
  const currentUserId = session?.user?.id;

  return {
    // Data
    teamMembers,
    invitations,
    
    // Loading states
    isLoadingMembers,
    isLoadingInvitations,
    isLoading: isLoadingMembers || isLoadingInvitations,
    
    // Errors
    membersError: membersError as MyError | null,
    invitationsError: invitationsError as MyError | null,
    
    // Actions
    inviteUser: inviteUserMutation.mutateAsync,
    cancelInvitation: cancelInvitationMutation.mutateAsync,
    removeTeamMember: removeTeamMemberMutation.mutateAsync,
    
    // Refetch functions
    refetchMembers,
    refetchInvitations,
    
    // Mutation states
    isInviting: inviteUserMutation.isPending,
    isCancelling: cancelInvitationMutation.isPending,
    isRemoving: removeTeamMemberMutation.isPending,
    
    // Current user info
    currentUserId,
  };
}