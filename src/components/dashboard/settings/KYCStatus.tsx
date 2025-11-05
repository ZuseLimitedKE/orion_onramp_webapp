import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

const KYCStatus = () => {
  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>KYC Verification</CardTitle>
          </div>
          <CardDescription>
            Complete your business verification to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
            <div>
              <p className="font-semibold text-foreground">
                Verification Status
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is fully verified
              </p>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              Verified
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">
                  Business Registration
                </p>
                <p className="text-sm text-muted-foreground">
                  Certificate verified
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Complete
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">
                  Identity Verification
                </p>
                <p className="text-sm text-muted-foreground">
                  Director IDs verified
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Complete
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-sm text-muted-foreground">
                  Settlement account verified
                </p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default KYCStatus
