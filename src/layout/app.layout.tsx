import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthProvider } from '@/context/auth-provider';
import DashboardNav from '@/components/nav/DashboardNav';
import SearchContainer from '@/components/search/SearchContainer'; // Import the new container


const AppLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AuthProvider>
      <DashboardNav onSearchClick={() => setIsSearchOpen(true)} />
      <Outlet />
      {/* <SidebarProvider>
        <AppSideBar />
        <SidebarInset className="overflow-x-hidden">
          <div className="w-full">
            <>
              <Header />
              <div className="px-3 lg:px-20 py-3">
              </div>
            </>
          </div>
        </SidebarInset>
      </SidebarProvider> */}

      {/* The Search Overlay */}
      <SearchContainer
        isSearchOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

    </AuthProvider>
  );
};

export default AppLayout;
