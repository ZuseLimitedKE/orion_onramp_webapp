import { Link, useRouterState } from '@tanstack/react-router';
import { type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
  mainLinks,
}: {
  mainLinks: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isExternalUrl = (url: string) =>
  /^(https?:|mailto:|tel:|ftp:|\/\/)/i.test(url);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {mainLinks.map((item) => {
          const external = isExternalUrl(item.url);

          // only compute "active" for internal links.
          const isActive =
            !external &&
            (currentPath === item.url ||
              (item.url !== '/dashboard/' && currentPath.startsWith(item.url)));

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive}>
                {external ? (
                  // external link: render anchor that opens in new tab.
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.title}
                    className="flex items-center gap-2"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                ) : (
                  // internal link: use TanStack Link
                  <Link to={item.url} className="flex items-center gap-2" aria-label={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
