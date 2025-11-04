import {
  BookOpen,
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
      name: 'Add a Business',
      logo: Plus,
    },
  ],
  mainLinks: [
    {
      title: 'Home',
      url: '#',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
  ],
  paymentLinks: [
    {
      name: 'Transactions',
      url: '#',
      icon: CreditCard,
    },
    {
      name: 'Customers',
      url: '#',
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
