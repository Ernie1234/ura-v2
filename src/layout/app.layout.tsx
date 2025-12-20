import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthProvider } from '@/context/auth-provider';
import SearchContainer from '@/components/search/SearchContainer'; // Import the new container
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/shared/AppSideBar';
import Header from '@/components/Headers/Header';
import MobileBottomNav from '@/components/nav/MobileBottomNav';
import VerificationBanner from '@/components/nav/VerificationBanner';


const AppLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white">
          <AppSideBar />
          
          <SidebarInset className="flex flex-col flex-1 overflow-x-hidden">

            <VerificationBanner />

            <Header onSearchClick={() => setIsSearchOpen(true)} />
            
            <main className="flex-1 pb-18 lg:pb-0">
              <div className="">
                <Outlet />
              </div>
            </main>

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
