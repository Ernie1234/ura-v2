// src/components/feed/AppSideBar.tsx
import { useState } from 'react';
import { EllipsisIcon, Loader, LogOut, User } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-provider';
import Logo from './Logo';
import LogoutDialog from './LogoutDialog';
import { NavMain } from '../nav/NavMain';

const AppSideBar = () => {
  const { isLoading, user } = useAuthContext();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-gray-100">
        <SidebarHeader className="h-[70px] flex items-center justify-center bg-background border-b border-gray-50">
          <Logo url={`/dashboard`} />
        </SidebarHeader>

        <SidebarContent className="bg-background">
          <SidebarGroup className="py-4">
            <SidebarGroupContent>
              <NavMain />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-background p-4 border-t border-gray-50">
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <div className="flex justify-center py-2"><Loader className="animate-spin text-orange-500" size={20} /></div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="hover:bg-gray-100 transition-colors">
                      <Avatar className="h-9 w-9 border-2 border-orange-100">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="bg-orange-500 text-white">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-bold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="truncate text-[11px] text-gray-500">{user?.email}</span>
                      </div>
                      <EllipsisIcon className="ml-auto size-4 text-gray-400" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2" side="right" align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 cursor-pointer" 
                      onClick={() => setIsLogoutOpen(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <LogoutDialog isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
    </>
  );
};

export default AppSideBar;