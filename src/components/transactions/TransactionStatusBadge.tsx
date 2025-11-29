import { ArrowUpDown, CheckCircle2, Clock, RefreshCw, XCircle, } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLORS,
} from '@/types/transactions';

interface TransactionStatusBadgeProps {
  status: TRANSACTION_STATUS;
  className?: string;
  showIcon?: boolean;
}

const statusIcons = {
  [TRANSACTION_STATUS.PENDING]: Clock,
  [TRANSACTION_STATUS.SUCCESSFUL]: CheckCircle2,
  [TRANSACTION_STATUS.FAILED]: XCircle,
  [TRANSACTION_STATUS.ONRAMPED]: RefreshCw,
  [TRANSACTION_STATUS.OFFRAMPED]: ArrowUpDown,
};

const statusLabels = {
  [TRANSACTION_STATUS.PENDING]: 'Pending',
  [TRANSACTION_STATUS.SUCCESSFUL]: 'Successful',
  [TRANSACTION_STATUS.FAILED]: 'Failed',
  [TRANSACTION_STATUS.ONRAMPED]: 'Onramped',
  [TRANSACTION_STATUS.OFFRAMPED]: 'Offramped',
};

export function TransactionStatusBadge({
  status,
  className,
  showIcon = true,
}: TransactionStatusBadgeProps) {
  const Icon = statusIcons[status];
  const label = statusLabels[status];

  return (
    <Badge
      variant="secondary"
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium border',
        TRANSACTION_STATUS_COLORS[status],
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
}