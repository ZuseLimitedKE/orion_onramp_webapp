import { createFileRoute } from '@tanstack/react-router'
import { BusinessCreationWizard } from '@/components/business/creation/BusinessCreationWizard'

export const Route = createFileRoute('/dashboard/business/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BusinessCreationWizard />
}
