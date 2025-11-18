import {
  BookOpen,
  Building2,
  CreditCard,
  Home,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import { NavMain } from '@/components/dashboard/sidebar/nav-main'
import { NavPayments } from '@/components/dashboard/sidebar/nav-payments'
import { ActionSwitcher } from '@/components/dashboard/sidebar/action-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  actions: [
    {
      name: 'Switch Business',
      logo: Building2,
    },
  ],
  mainLinks: [
    {
      title: 'Home',
      url: '/dashboard/',
      icon: Home,
    },
    {
      title: 'Create Business',
      url: '/dashboard/business/create',
      icon: Plus,
    },
    {
      title: 'Documentation',
      url: '/dashboard/',
      icon: BookOpen,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings,
    },
  ],
  paymentLinks: [
    {
      name: 'Transactions',
      url: '/dashboard/transactions',
      icon: CreditCard,
    },
    {
      name: 'Customers',
      url: '/dashboard/',
      icon: Users,
    },
  ],
}

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ActionSwitcher actions={data.actions} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain mainLinks={data.mainLinks} />
        <NavPayments paymentLinks={data.paymentLinks} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
