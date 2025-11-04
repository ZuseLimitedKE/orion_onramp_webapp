// import { Link } from '@tanstack/react-router'

// const DashboardSidebar = () => {
//   return (
//     <aside className="w-64 bg-gray-800 text-white p-4">
//       <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//       <nav className="space-y-2">
//         <Link
//           to="/dashboard"
//           className="block px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Overview
//         </Link>
//         <Link
//           to="/dashboard"
//           className="block px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Analytics
//         </Link>
//         <Link
//           to="/"
//           className="block px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Users
//         </Link>
//         <Link
//           to="/"
//           className="block px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Settings
//         </Link>
//       </nav>
//     </aside>
//   )
// }

// export default DashboardSidebar

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
