// src/components/feed/AppSideBar.tsx
import { useState } from 'react';
import { EllipsisIcon, Loader, LogOut, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
import { Button } from '../ui/button';

const AppSideBar = () => {
  const { isLoading, user } = useAuthContext();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-gray-100 hidden md:flex">

        <SidebarHeader className="h-auto flex flex-col bg-background border-b border-gray-50 p-4 transition-all duration-300">
          <div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center">
            <Logo url={`/dashboard`} />
          </div>

          <div className="mt-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Create Post" // 🚨 Tooltip appears when collapsed
                  className="h-auto p-0 hover:bg-transparent active:bg-transparent"
                >
                  <Button
                    onClick={() => navigate('/dashboard/post/create?type=post')}
                    className={`
              bg-gradient-to-r from-orange-500 to-orange-600 
              hover:from-orange-600 hover:to-orange-700
              text-white shadow-lg shadow-orange-200/50 
              transition-all duration-300 ease-in-out
              active:scale-95 border-none
              group-data-[collapsible=icon]:h-10 
              group-data-[collapsible=icon]:w-10 
              group-data-[collapsible=icon]:p-0
              group-data-[collapsible=icon]:rounded-xl
              h-11 w-full rounded-xl gap-2 flex items-center justify-center
            `}
                  >
                    <Plus
                      size={20}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:rotate-90 shrink-0"
                    />
                    <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">
                      Create Post
                    </span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-background scrollbar-none">
          <NavMain />
        </SidebarContent>

        <SidebarFooter className="bg-background p-4 border-t border-gray-50">
          {/* ... keeping your existing Footer logic ... */}
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <div className="flex justify-center py-2">
                  <Loader className="animate-spin text-orange-500" size={20} />
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="hover:bg-gray-100 transition-colors rounded-xl h-12">
                      <Avatar className="h-9 w-9 border-2 border-orange-100 ring-2 ring-transparent group-hover:ring-orange-50 transition-all">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="bg-orange-500 text-white font-bold">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-bold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="truncate text-[11px] text-gray-500 font-medium">{user?.email}</span>
                      </div>
                      <EllipsisIcon className="ml-auto size-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2 rounded-xl p-2 shadow-xl border-gray-100" side="right" align="end">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg py-2.5"
                      onClick={() => navigate(`/dashboard/profile/${user?._id}`)}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="font-medium">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 cursor-pointer rounded-lg py-2.5"
                      onClick={() => setIsLogoutOpen(true)}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Log out</span>
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