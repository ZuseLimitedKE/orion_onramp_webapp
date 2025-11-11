import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BusinessProfile from './BusinessProfile'
import KYCStatus from './KYCStatus'
import WebHook from './WebHook'
import TeamMembers from './TeamMembers'
import Environments from './Environments'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your business profile and account settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-primary/5">
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="kyc">KYC Status</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <BusinessProfile />
          <TeamMembers />
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <KYCStatus />
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Environments />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <WebHook />
        </TabsContent>
      </Tabs>
    </div>
  )
}
