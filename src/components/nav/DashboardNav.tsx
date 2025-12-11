import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';
import { menuItems } from '@/lib/data';
import { cn } from '@/lib/utils';
import { DashboardAvatar } from '../dashboard/DashboardAvatar';
import { Divide, Settings } from 'lucide-react';

const DashboardNav = () => {
  return (
    <header className="sticky top-0 z-20 w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-12 lg:px-16 py-4">
        <div aria-label="home" className="flex items-center space-x-2">
          <Logo url='/dashboard' />
        </div>

        {/* Desktop Nav */}
        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
          <ul className="flex gap-8 text-sm">
            {menuItems.map(({ name, to, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn(
                      'flex items-center gap-1 duration-150',
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-accent-foreground',
                    )}
                  >
                    <Icon size={16} />
                    <span>{name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Menu */}
        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
          <div className="lg:hidden">
            <ul className="space-y-6 text-base">
              {menuItems.map(({ name, to, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={cn(
                        'flex items-center gap-2 duration-150',
                        isActive
                          ? 'text-foreground font-semibold'
                          : 'text-muted-foreground hover:text-accent-foreground',
                      )}
                    >
                      <Icon size={18} />
                      <span>{name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex w-full items-center space-x-4">
            <Link to="/dashboard/settings">
              <Settings className="text-orange-400" />
            </Link>
            <DashboardAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;
