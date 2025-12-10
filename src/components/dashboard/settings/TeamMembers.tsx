import { useState } from 'react';
import { AlertCircle, Calendar, Loader2, Mail, Trash2, UserPlus, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTeamManagement } from '@/hooks/teams/useTeamManagement';
import { InviteUserModal } from '@/components/teams/InviteUserModal';
import { InvitationStatusBadge } from '@/components/teams/InvitationStatusBadge';
import { TeamMemberBadge } from '@/components/teams/TeamMemberBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { USER_INVITATION_STATUS, USER_ROLES } from '@/types/businesses';

export default function TeamMembers() {
  const { currentBusiness } = useBusinessContext();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const {
    teamMembers,
    invitations,
    isLoading,
    isInviting,
    isCancelling,
    isRemoving,
    inviteUser,
    cancelInvitation,
    removeTeamMember,
    currentUserId,
  } = useTeamManagement({
    businessId: currentBusiness?.id ?? '',
  });

  if (!currentBusiness) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select a business to manage team members.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleCancelInvitation = async (inviteId: string) => {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      await cancelInvitation(inviteId);
    }
  };

  const handleRemoveTeamMember = async (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      await removeTeamMember(memberId);
    }
  };

  // Wrapper to handle the type mismatch
  const handleInviteUser = async (data: { email: string; role: USER_ROLES }) => {
    await inviteUser(data);
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === USER_INVITATION_STATUS.PENDING
  );

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading team information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage access for your team members and invitations
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowInviteModal(true)}
              disabled={isInviting}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Members Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Team</h3>
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No team members yet. Invite someone to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const isCurrentUser = member.userId === currentUserId;
                  const isOwner = member.userId === currentBusiness.ownerId;
                  const canRemove = !isCurrentUser && !isOwner;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">
                                {member.name || 'Unknown User'}
                              </p>
                              {isCurrentUser && (
                                <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {member.email || 'No email'}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Joined {formatDate(member.joinedAt)}
                              </div>
                            </div>
                          </div>
                          <TeamMemberBadge
                            role={member.role}
                            isOwner={isOwner}
                          />
                        </div>
                      </div>
                      {canRemove && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeamMember(member.id, member.name)}
                          disabled={isRemoving}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Invitations Section */}
          {pendingInvitations.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
                <div className="space-y-3">
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">
                                {invitation.email}
                              </p>
                              <InvitationStatusBadge status={invitation.status} />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-muted-foreground">
                                Role: {invitation.role}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Invited {formatDate(invitation.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={isCancelling}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Other Invitations Section */}
          {invitations.filter(
            inv => inv.status !== USER_INVITATION_STATUS.PENDING
          ).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Previous Invitations</h3>
                <div className="space-y-2">
                  {invitations
                    .filter(inv => inv.status !== USER_INVITATION_STATUS.PENDING)
                    .map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {invitation.role}
                            </span>
                            <InvitationStatusBadge status={invitation.status} />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(invitation.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Invite User Modal */}
      <InviteUserModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        onInvite={handleInviteUser}
        isInviting={isInviting}
        businessId={currentBusiness.id}
      />
    </>
  );
}