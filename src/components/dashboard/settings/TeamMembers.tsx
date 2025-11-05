import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const TeamMembers = () => {
  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage access for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">john@acmecorp.com</p>
                <p className="text-sm text-muted-foreground">Admin</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">You</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">jane@acmecorp.com</p>
                <p className="text-sm text-muted-foreground">Developer</p>
              </div>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            Invite Team Member
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default TeamMembers
