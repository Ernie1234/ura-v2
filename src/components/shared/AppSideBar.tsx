import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EllipsisIcon, Loader, LogOut } from 'lucide-react';
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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Separator } from '../ui/separator';
import { useAuthContext } from '@/context/auth-provider';
import Logo from './Logo';
import LogoutDialog from './LogoutDialog';
import { NavMain } from '../nav/NavMain';
import { NavProjects } from '../nav/NavProjects';

const AppSideBar = () => {
  const { isLoading, user } = useAuthContext();

  const { open } = useSidebar();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="!py-0 bg-background">
          <div className="flex h-[50px] items-center justify-start w-full px-1">
            <Logo url={`/dashboard`} />
            {open && (
              <Link
                to={`/dashboard`}
                className="hidden md:flex ml-2 items-center gap-2 self-center font-medium"
              >
                Url
              </Link>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className=" !mt-0 bg-background overflow-y-auto hide-scrollbar">
          <SidebarGroup className="!py-0">
            <SidebarGroupContent>
              <Separator />
              <NavMain />
              <Separator />
              <NavProjects />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-background">
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <Loader size="24px" className="place-self-center self-center animate-spin" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={user?.profilePicture || ''} />
                        <AvatarFallback className="rounded-full border border-gray-500">
                          {user?.firstName?.charAt(0)}
                          {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                      <EllipsisIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={'bottom'}
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup></DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsOpen(true)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default AppSideBar;
