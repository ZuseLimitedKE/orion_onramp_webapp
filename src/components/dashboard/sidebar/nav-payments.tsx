import { Link, useRouterState } from '@tanstack/react-router'
import {
  type LucideIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavPayments({
  paymentLinks,
}: {
  paymentLinks: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Payments</SidebarGroupLabel>
      <SidebarMenu>
        {paymentLinks.map((item) => {
          const isActive = currentPath === item.url || 
                          (item.url !== '/dashboard/' && currentPath.startsWith(item.url))
          
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
