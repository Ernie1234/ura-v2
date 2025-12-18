import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, MessageCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileBottomNav({ onSearchClick }: { onSearchClick: () => void }) {
  const { pathname } = useLocation();

  const navItems = [
    { name: 'Home', to: '/dashboard', icon: Home },
    { name: 'Search', onClick: onSearchClick, icon: Search },
    { name: 'Post', to: '/post/create', icon: PlusSquare },
    { name: 'Chats', to: '/dashboard/chats', icon: MessageCircle },
    { name: 'More', to: '/dashboard/menu', icon: MoreHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-1 py-2 z-50">
      <ul className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;

          const content = (
            <div className={cn(
              "flex flex-col items-center gap-1 transition-all duration-200",
              isActive ? "text-[#E67E22]" : "text-gray-600"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{item.name}</span>
            </div>
          );

          return (
            <li key={item.name} className="flex-1">
              {item.onClick ? (
                <button onClick={item.onClick} className="w-full py-1">{content}</button>
              ) : (
                <Link to={item.to!} className="w-full py-1 block">{content}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}