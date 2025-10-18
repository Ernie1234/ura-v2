import {
  Settings,
  LayoutDashboard,
  Bell,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  showBadge?: boolean; // Add this property
};

export function NavMain() {

  const location = useLocation();

  const pathname = location.pathname;

  const unreadNotificationsCount = 3
   const canManageSettings = true

  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/dashboard`,
      icon: LayoutDashboard,
      showBadge: false,
    },
    {
      title: "Chat",
      url: `/dashboard/chat`,
      icon: MessageCircle,
      showBadge: false,
    },
    {
      title: "Notifications",
      url: `/dashboard/notifications`,
      icon: Bell,
      showBadge: true,
    },

    ...(canManageSettings
      ? [
          {
            title: "Settings",
            url: `/dashboard/settings`,
            icon: Settings,
            showBadge: false,
          },
        ]
      : []),
  ];
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={item.url === pathname}
              asChild
              className="hover:bg-muted-foreground/10"
            >
              <Link to={item.url} className="!text-[15px]">
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.showBadge && unreadNotificationsCount > 0 && (
              <SidebarMenuBadge>{unreadNotificationsCount}</SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
