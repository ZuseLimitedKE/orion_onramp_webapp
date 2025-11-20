import { Link, useRouterState } from '@tanstack/react-router'
import { type LucideIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain({
  mainLinks,
}: {
  mainLinks: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {mainLinks.map((item) => {
          const isActive = currentPath === item.url || 
                          (item.url !== '/dashboard/' && currentPath.startsWith(item.url))
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
