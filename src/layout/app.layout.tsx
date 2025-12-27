import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthProvider, useAuthContext } from '@/context/auth-provider'; // Import hook
import SearchContainer from '@/components/search/SearchContainer';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/shared/AppSideBar';
import Header from '@/components/Headers/Header';
import MobileBottomNav from '@/components/nav/MobileBottomNav';
import VerificationBanner from '@/components/nav/VerificationBanner';
import { socketService } from '@/services/socket.service';
import { toast } from 'sonner';
import { CartProvider } from '@/context/cart-provider';
import { NotificationProvider } from '@/context/notification-provider';
import { SocketSync } from '@/context/socket-sync';

const AppLayoutContent = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    // Only initialize socket if user is logged in
    if (isAuthenticated && user) {
      const profileId = user._id || user._id || (user as any).userId;

      // 1. Establish Connection
      socketService.connect();

      // 2. Identity Setup (backend uses this to join rooms)
      socketService.setup(profileId.toString());

      // 3. Listen for Live Notifications (matching backend event name)
      socketService.on('notification_received', (data) => {
        // data usually contains { message, type, sender, etc. }
        toast.info(data.message || "You have a new notification");
      });

      // 4. Listen for Real-time Messages (if your backend emits message:received)
      socketService.on('message:received', (newMessage) => {
        // Only toast if we aren't currently looking at that specific chat
        toast(`New message from ${newMessage.sender?.firstName || 'User'}`);
      });

      // Cleanup on logout/unmount
      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <>
    <SocketSync />
      <NotificationProvider>
        <CartProvider>
          <SidebarProvider>
            {/* FIX: 'fixed' background ensures the glassy vibe 
              works on EVERY page, not just the home page.
          */}
            <div className="fixed inset-0 -z-10 bg-[#FAFAFB] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="flex min-h-screen w-full">
              <AppSideBar />

              <SidebarInset className="flex flex-col flex-1 h-screen overflow-y-auto overflow-x-hidden bg-transparent scrollbar-base scrollbar-main">
                <VerificationBanner />

                {/* Header Glass: Lowered opacity to 40% for better transparency */}
                <div className="sticky top-0 z-40 w-full bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm">
                  <Header onSearchClick={() => setIsSearchOpen(true)} />
                </div>

                <main className="flex-1 pb-24 lg:pb-10">
                  {/* Ensure your Page components inside <Outlet /> 
                    don't have 'bg-white' classes on their parent containers 
                */}
                  <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-6">
                    <Outlet />
                  </div>
                </main>

                <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
              </SidebarInset>
            </div>

            <SearchContainer isSearchOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          </SidebarProvider>
        </CartProvider>
      </NotificationProvider>
    </>
  );
};

// Wrap with AuthProvider first so we can use its context inside the content
const AppLayout = () => (
  <AuthProvider>
    <AppLayoutContent />
  </AuthProvider>
);

export default AppLayout;