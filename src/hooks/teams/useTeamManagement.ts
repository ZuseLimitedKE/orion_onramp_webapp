import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  BusinessUser,
  Invitation,
  InviteUserFormData,
  TeamMember,
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
    queryFn: async () => {
      const response = await businessApi.getTeamMembers(businessId);
      return response;
    },
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

  // Get current user info from session
  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;
  const currentUserName = session?.user?.name;

  const teamMembers: Array<TeamMember> = (teamMembersData?.members || []).map((member: BusinessUser) => {
    
    // If this is the current user and the user data is missing, use session data
    const isCurrentUser = member.userId === currentUserId;
    
    const processedMember: TeamMember = {
      id: member.id,
      userId: member.userId,
      businessId: member.businessId,
      role: member.role,
      joinedAt: member.joinedAt,
      name: member.user?.name || (isCurrentUser ? currentUserName : undefined) || 'Me - Unknown Name',
      email: member.user?.email || (isCurrentUser ? currentUserEmail : undefined) || 'No email',
      phoneNumber: member.user?.phoneNumber,
      businessName: member.user?.businessName,
      isOwner: false,
    };

    return processedMember;
  });

  const invitations: Array<Invitation> = invitationsData?.invitations || [];

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
    currentUserEmail,
    currentUserName,
  };
}