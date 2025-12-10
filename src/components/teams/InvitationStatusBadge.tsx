import { Ban, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { INVITATION_STATUS_COLORS, USER_INVITATION_STATUS } from '@/types/businesses';

interface InvitationStatusBadgeProps {
  status: USER_INVITATION_STATUS;
  className?: string;
}

const statusIcons = {
  [USER_INVITATION_STATUS.PENDING]: Clock,
  [USER_INVITATION_STATUS.ACCEPTED]: CheckCircle,
  [USER_INVITATION_STATUS.REJECTED]: XCircle,
  [USER_INVITATION_STATUS.EXPIRED]: Calendar,
  [USER_INVITATION_STATUS.CANCELLED]: Ban,
};

const statusLabels = {
  [USER_INVITATION_STATUS.PENDING]: 'Pending',
  [USER_INVITATION_STATUS.ACCEPTED]: 'Accepted',
  [USER_INVITATION_STATUS.REJECTED]: 'Rejected',
  [USER_INVITATION_STATUS.EXPIRED]: 'Expired',
  [USER_INVITATION_STATUS.CANCELLED]: 'Cancelled',
};

export function InvitationStatusBadge({
  status,
  className,
}: InvitationStatusBadgeProps) {
  const Icon = statusIcons[status];
  const label = statusLabels[status];

  return (
    <Badge
      variant="secondary"
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        INVITATION_STATUS_COLORS[status],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}