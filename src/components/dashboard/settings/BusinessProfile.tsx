import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const BusinessProfile = () => {
  const [businessName, setBusinessName] = useState('Acme Corp')
  const [email, setEmail] = useState('contact@acmecorp.com')

  const handleSaveProfile = () => {
    toast.success('Business profile updated successfully')
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Business Information</CardTitle>
          </div>
          <CardDescription>
            Update your business details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-id">Business ID</Label>
            <Input
              id="business-id"
              value="BUS_ABC123XYZ"
              readOnly
              className="bg-secondary"
            />
          </div>
          <Button
            onClick={handleSaveProfile}
            className="bg-primary hover:bg-primary-hover"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default BusinessProfile
