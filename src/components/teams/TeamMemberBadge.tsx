import { Code, Crown, DollarSign, Headphones, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { USER_ROLES, USER_ROLE_BADGES } from '@/types/businesses';

interface TeamMemberBadgeProps {
  role: USER_ROLES;
  className?: string;
  isOwner?: boolean;
}

const roleIcons = {
  [USER_ROLES.ADMIN]: Shield,
  [USER_ROLES.DEVELOPER]: Code,
  [USER_ROLES.FINANCE]: DollarSign,
  [USER_ROLES.SUPPORT]: Headphones,
};

export function TeamMemberBadge({
  role,
  className,
  isOwner = false,
}: TeamMemberBadgeProps) {
  const Icon = roleIcons[role];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-medium',
          USER_ROLE_BADGES[role],
          className
        )}
      >
        <Icon className="h-3 w-3" />
        {role}
      </Badge>
      {isOwner && (
        <Badge variant="outline" className="inline-flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Owner
        </Badge>
      )}
    </div>
  );
}