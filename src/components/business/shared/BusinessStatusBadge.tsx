import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BUSINESS_STATUS, BUSINESS_STATUS_COLORS } from '@/types/businesses'

interface BusinessStatusBadgeProps {
  status: BUSINESS_STATUS
  className?: string
}

export function BusinessStatusBadge({
  status,
  className,
}: BusinessStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'text-xs font-medium',
        BUSINESS_STATUS_COLORS[status],
        className,
      )}
    >
      {status}
    </Badge>
  )
}
