// src/pages/dashboard/MenuPage.tsx
import { 
  CreditCard, 
  Calendar, 
  Tag, 
  BadgePercent, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatarUrl } from '@/utils/avatar-generator';
import LogoutDialog from '@/components/shared/LogoutDialog';
import { useState } from 'react';

const MenuPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const menuItems = [
    { title: 'Payments & Transactions', icon: CreditCard, path: '/dashboard/wallet' },
    { title: 'Events', icon: Calendar, path: '/dashboard/events' },
    { title: 'Deals and Offers', icon: Tag, path: '/dashboard/deals' },
    { title: 'Tailored Business Loan', icon: BadgePercent, path: '/dashboard/loans' },
    { title: 'Help & Support', icon: HelpCircle, path: '/dashboard/support' },
    { title: 'Settings & Privacy', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-50">
        <h1 className="text-xl font-bold w-full text-center">Features</h1>
      </div>

      {/* User Profile Section */}
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate(`/profile/user/${user?._id}`)}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-orange-100">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              <img src={generateAvatarUrl(user?.username || 'user')} alt="avatar" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Go to Profile</p>
          </div>
        </div>
        <ChevronRight className="text-gray-400" size={20} />
      </div>

      {/* Navigation List */}
      <div className="flex flex-col px-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-between p-4 hover:bg-orange-50/50 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <item.icon size={22} className="text-orange-600" />
              </div>
              <span className="font-semibold text-gray-800 text-[15px]">{item.title}</span>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-orange-400" size={18} />
          </button>
        ))}

        {/* Separator */}
        <div className="my-2 border-t border-gray-100 mx-4" />

        {/* Sign Out Button */}
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <div className="p-2 bg-red-50 rounded-lg">
            <LogOut size={22} />
          </div>
          <span className="font-semibold text-[15px]">Sign Out</span>
        </button>
      </div>

      <LogoutDialog isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
    </div>
  );
};

export default MenuPage;