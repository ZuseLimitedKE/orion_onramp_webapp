import { AlertCircle } from 'lucide-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import BusinessProfile from './BusinessProfile'
import KYCStatus from './KYCStatus'
import WebHook from './WebHook'
import TeamMembers from './TeamMembers'
import Environments from './Environments'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBusinessContext } from '@/contexts/BusinessContext'
import TokenAssociation from './TokenAssociation'
import { HWBridgeProvider } from '@buidlerlabs/hashgraph-react-wallets'
import { HashpackConnector, KabilaConnector, HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors'
import { HederaTestnet, HederaMainnet } from '@buidlerlabs/hashgraph-react-wallets/chains'

const metadata = {
  name: 'Orion Onramp',
  description: 'Created using Hashgraph React Wallets',
  icons: ['/favicon.ico'],
  url: "https://oriononramp.com",
}

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is not configured. Wallet connection features may not work.')
}

export function SettingsPage() {
  const { currentBusiness, isLoading } = useBusinessContext()
  const navigate = useNavigate({ from: '/dashboard/settings' })
  const search = useSearch({ from: '/dashboard/settings' })
  const activeTab = search.tab

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your business profile and account settings
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(tab) =>
          navigate({
            search: (prev) => ({
              ...prev,
              tab: tab as "profile" | "kyc" | "api-keys" | "webhooks" | "token-association",
            }),
          })
        } className="space-y-6">
        <TabsList className="bg-primary/5">
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="kyc">KYC Status</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="token-association">Token Association</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <BusinessProfile />
          <TeamMembers />
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <KYCStatus />
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : !currentBusiness ? (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      No Business Selected
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Please create a business or select one from the business switcher to manage API environments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Environments 
              businessId={currentBusiness.id} 
              businessStatus={currentBusiness.status}
            />
          )}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <WebHook />
        </TabsContent>
        <TabsContent value="token-association" className="space-y-4">
          <HWBridgeProvider
            metadata={metadata}
            projectId={projectId}
            connectors={[HWCConnector, HashpackConnector, KabilaConnector]}
            chains={[HederaTestnet, HederaMainnet]}
          >
            <TokenAssociation />
        </HWBridgeProvider>
        </TabsContent>
      </Tabs>
    </div>
  )
}
