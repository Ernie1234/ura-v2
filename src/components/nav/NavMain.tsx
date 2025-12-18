// src/components/nav/NavMain.tsx
import { 
  Settings, 
  LayoutDashboard, 
  Bell, 
  MessageCircle, 
  Calendar, 
  Tag, 
  Wallet,
  ShoppingBag,
  UserCircle,
  type LucideIcon 
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  showBadge?: boolean;
  badgeValue?: number;
};

export function NavMain() {
  const location = useLocation();
  const pathname = location.pathname;

  const items: ItemType[] = [
    { title: 'Feed', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Chat', url: '/dashboard/chat', icon: MessageCircle, showBadge: true, badgeValue: 5 },
    { title: 'Deals & Offers', url: '/dashboard/deals', icon: Tag },
    { title: 'Events', url: '/dashboard/events', icon: Calendar },
    { title: 'My Orders', url: '/dashboard/orders', icon: ShoppingBag },
    { title: 'Wallet', url: '/dashboard/wallet', icon: Wallet },
    { title: 'Notifications', url: '/dashboard/notifications', icon: Bell, showBadge: true, badgeValue: 3 },
    { title: 'Settings', url: '/dashboard/settings', icon: Settings },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="mb-1">
            <SidebarMenuButton
              isActive={item.url === pathname}
              asChild
              tooltip={item.title}
              className={`transition-all duration-200 ${
                item.url === pathname 
                ? "bg-orange-50 text-orange-600 hover:bg-orange-50 hover:text-orange-600" 
                : "hover:bg-gray-100"
              }`}
            >
              <Link to={item.url} className="flex items-center gap-3 py-6">
                <item.icon className={`${item.url === pathname ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} size={20} />
                <span className="font-medium text-[14px]">{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.showBadge && (item.badgeValue ?? 0) > 0 && (
              <SidebarMenuBadge className="bg-orange-500 text-white border-none">
                {item.badgeValue}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}