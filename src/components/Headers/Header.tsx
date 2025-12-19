import { Link, useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Info, Search, Image as ImageIcon, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../shared/Logo';
import { DashboardAvatar } from '../dashboard/DashboardAvatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '../ui/separator';

export default function Header({ onSearchClick }: { onSearchClick: () => void }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Breadcrumb Logic
  const getPageLabel = (path: string) => {
    if (path.includes('/post/create')) return 'Create Post';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/profile/user')) return 'User Profile';
    if (path.includes('/profile/business')) return 'Business Profile';
    if (path.includes('/chat')) return 'Chat';
    if (path.includes('/activity')) return 'Activity';
    if (path.includes('/bookmark')) return 'Bookmark';
    if (path.includes('/notifications')) return 'Notifications';
    return null;
  };
  const pageHeading = getPageLabel(pathname);

  const desktopMenu = [
    { name: 'Home', to: '/dashboard', icon: Home },
    { name: 'About', to: '/about', icon: Info },
    { name: 'Search', onClick: onSearchClick, icon: Search },
    { name: 'Picture Search', to: '/search/image', icon: ImageIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        
        {/* LEFT: Mobile (Trigger/Logo) | Desktop (Trigger/Breadcrumbs) */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <SidebarTrigger className="hidden" />
          <div className="lg:hidden">
            <Logo url="/dashboard" />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="text-[14px]">
                  {pageHeading ? (
                    <BreadcrumbLink asChild>
                      <Link to="/dashboard" className="text-gray-500">Dashboard</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-semibold text-black">Dashboard</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {pageHeading && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="text-[14px]">
                      <BreadcrumbPage className="font-semibold text-black">{pageHeading}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* CENTER: Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {desktopMenu.map((item) => {
            const isActive = pathname === item.to;
            const Icon = item.icon;
            const baseClass = cn(
              "flex items-center gap-2 text-[14px] font-semibold transition-colors hover:text-[#E67E22]",
              isActive ? "text-black" : "text-gray-500"
            );

            return item.onClick ? (
              <button key={item.name} onClick={item.onClick} className={baseClass}>
                <Icon size={18} /> {item.name}
              </button>
            ) : (
              <Link key={item.name} to={item.to!} className={baseClass}>
                <Icon size={18} /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Global Actions */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-[100px] justify-end">
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition">
            <Bell size={22} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="sm:block">
            <DashboardAvatar />
          </div>
        </div>
      </div>
    </header>
  );
}