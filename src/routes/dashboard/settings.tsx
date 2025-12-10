import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { SettingsPage } from '@/components/dashboard/settings/SettingsPage'

const settingsSearchSchema = z.object({
  tab: z.enum(['profile', 'kyc', 'team', 'api-keys', 'webhooks', 'token-association']).catch('profile'),
})

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
  validateSearch: settingsSearchSchema,
})

function RouteComponent() {
  return <SettingsPage />
}
