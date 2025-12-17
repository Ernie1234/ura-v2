import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthProvider } from '@/context/auth-provider';
import DashboardNav from '@/components/nav/DashboardNav';
import SearchContainer from '@/components/search/SearchContainer'; // Import the new container
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/shared/AppSideBar';
import Header from '@/components/Headers/Header';
import MobileBottomNav from '@/components/nav/MobileBottomNav';
import Logo from '@/components/shared/Logo';
import { Bell } from 'lucide-react';


const AppLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white">
          <AppSideBar />
          
          <SidebarInset className="flex flex-col flex-1 overflow-x-hidden">
            {/* The Unified Header now handles:
               - Mobile: Logo + Sidebar Trigger + Bell
               - Desktop: Sidebar Trigger + Breadcrumbs + Nav Menu + Avatar
            */}
            <Header onSearchClick={() => setIsSearchOpen(true)} />
            
            <main className="flex-1 pb-20 lg:pb-0">
              <div className="p-4 lg:p-8">
                <Outlet />
              </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
          </SidebarInset>
        </div>

        <SearchContainer
          isSearchOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </SidebarProvider> 
    </AuthProvider>
  );
};

export default AppLayout;
