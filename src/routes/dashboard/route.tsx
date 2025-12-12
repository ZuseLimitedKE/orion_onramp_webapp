import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/dashboard/sidebar/DashboardSidebar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  getSession,
  useSession,
  signOut,
} from '@/integrations/auth/auth-client'
import { redirect } from '@tanstack/react-router'
import { Bell, LogOut } from 'lucide-react'
import {
  BusinessProvider,
  useBusinessContext,
} from '@/contexts/BusinessContext'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
  beforeLoad: async () => {
    const session = await getSession()
    if (!session.data) {
      throw redirect({ to: '/' })
    }
  },
})

function getInitials(name: string | null | undefined): string {
  if (!name) return '??'

  const names = name.trim().split(' ')
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }

  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

function DashboardLayout() {
  const { data: session } = useSession()
  const navigate = useNavigate()
  const userInitials = getInitials(session?.user?.name)

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <>
      <BusinessProvider>
        <DashboardContent
          userInitials={userInitials}
          handleSignOut={handleSignOut}
        />
      </BusinessProvider>
    </>
  )
}

function DashboardContent({
  userInitials,
  handleSignOut,
}: {
  userInitials: string
  handleSignOut: () => void
}) {
  const { currentBusiness } = useBusinessContext()

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {currentBusiness && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {currentBusiness.tradingName ||
                    currentBusiness.legalBusinessName ||
                    'Untitled Business'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {currentBusiness.status}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 px-6">
            <Bell className="h-4 w-4" />
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
                <span className="text-sm font-medium" id="nav-dropdown">
                  {userInitials}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} id="logout-button">
                  <LogOut className="h-4 w-4 text-destructive" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
