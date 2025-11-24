import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Check } from 'lucide-react'
import { useBusinessContext } from '@/contexts/BusinessContext'
import { BUSINESS_STATUS_COLORS } from '@/types/businesses'

interface BusinessSwitcherProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BusinessSwitcher({ open, onOpenChange}: BusinessSwitcherProps) {
  const { businesses, currentBusiness, switchBusiness } = useBusinessContext()

  const handleSelectBusiness = (businessId: string) => {
    switchBusiness(businessId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Business</DialogTitle>
          <DialogDescription>
            Select which business you want to manage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {businesses.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                No businesses found
              </p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Create Your First Business
              </Button>
            </div>
          ) : (
            businesses.map((business) => {
              const isActive = currentBusiness?.id === business.id
              const statusColor = BUSINESS_STATUS_COLORS[business.status]

              return (
                <button
                  key={business.id}
                  onClick={() => handleSelectBusiness(business.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {business.tradingName ||
                            business.legalBusinessName ||
                            'Untitled Business'}
                        </h3>
                        {isActive && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {business.description || 'No description'}
                      </p>
                      <Badge variant="outline" className={statusColor}>
                        {business.status}
                      </Badge>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
