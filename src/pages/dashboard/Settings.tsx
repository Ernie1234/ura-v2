// src/pages/dashboard/SettingsPage.tsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, Lock, Bell, ShieldCheck, History, 
  CreditCard, ChevronLeft, ChevronRight, Activity, 
  Smartphone, Trash2, Globe, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityLog } from '@/components/settings/ActivityLog'
const SettingsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const action = searchParams.get('action');

  // Define Setting Groups
  const settingsGroups = [
    {
      label: "Account",
      items: [
        { id: 'profile', title: 'Edit Profile', icon: User, desc: 'Change avatar, name, and bio' },
        { id: 'security', title: 'Password & Security', icon: Lock, desc: '2FA, password updates' },
        { id: 'notifications', title: 'Notifications', icon: Bell, desc: 'Push and email alerts' },
      ]
    },
    {
      label: "Activity & Finances",
      items: [
        { id: 'activities', title: 'Recent Activity', icon: Activity, desc: 'Logs of your posts, likes, and comments' },
        { id: 'transactions', title: 'Transaction History', icon: History, desc: 'All payments and withdrawals' },
        { id: 'payment-methods', title: 'Saved Cards', icon: CreditCard, desc: 'Manage your payment options' },
      ]
    },
    {
      label: "Preferences & Privacy",
      items: [
        { id: 'privacy', title: 'Privacy Center', icon: ShieldCheck, desc: 'Who can see your posts and profile' },
        { id: 'language', title: 'Language', icon: Globe, desc: 'English (US)' },
        { id: 'devices', title: 'Logged Devices', icon: Smartphone, desc: 'Manage active sessions' },
      ]
    }
  ];

  // Render Sub-page Content based on ?action=
  const renderContent = () => {
    switch (action) {
      case 'activities':
        return <div className="p-4"> <ActivityLog activities={[]} /><h2 className="font-bold">Your Activities</h2> </div>;
      case 'transactions':
        return <div className="p-4"> {/* TransactionList Component would go here */} <h2 className="font-bold">Transaction History</h2> </div>;
      case 'profile':
        return <div className="p-4"> <h2 className="font-bold">Edit Profile</h2> </div>;
      // Add other cases...
      default:
        return null;
    }
  };

  // MOBILE VIEW: If action is present, show the sub-page content
  if (action && window.innerWidth < 768) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="p-4 flex items-center border-b sticky top-0 bg-white z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/settings')} className="mr-2">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="font-bold capitalize">{action.replace('-', ' ')}</h1>
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50/30 pb-20 md:pb-0">
      {/* LEFT COLUMN: Settings Menu */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-100 flex-shrink-0 ${action ? 'hidden md:flex' : 'flex'} flex-col`}>
        <div className="p-6 border-b border-gray-50">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {settingsGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{group.label}</h3>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/dashboard/settings?action=${item.id}`)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    action === item.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action === item.id ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                      <item.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className={`text-[11px] ${action === item.id ? 'text-orange-400' : 'text-gray-400'} md:hidden lg:block`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={action === item.id ? 'opacity-100' : 'opacity-30'} />
                </button>
              ))}
            </div>
          ))}

          {/* Danger Zone */}
          <div className="pt-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <div className="p-2 bg-red-50 rounded-lg"><Trash2 size={18} /></div>
              <span className="font-semibold text-sm">Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Content (Desktop Only) */}
      <div className="hidden md:flex flex-1 bg-white items-start justify-center overflow-y-auto">
        {action ? (
          <div className="w-full max-w-3xl p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {renderContent()}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="p-6 bg-gray-50 rounded-full"><Settings size={48} className="opacity-20" /></div>
            <p className="font-medium">Select a setting to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;