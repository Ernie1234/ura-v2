import { useState } from 'react';
import { useAuthContext } from '@/context/auth-provider';
import PersonalInfoForm from '../form/PersonalInfoForm';
import BusinessInfoForm from '../form/BusinessInfoForm';
import { cn } from '@/lib/utils';

export const ProfileSettings = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');

  // Logic: Hide business tab if they aren't an owner
  if (!user?.isBusinessOwner) {
    return <PersonalInfoForm />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('personal')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            activeTab === 'personal' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
          )}
        >
          Personal
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            activeTab === 'business' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
          )}
        >
          Business
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {activeTab === 'personal' ? <PersonalInfoForm /> : <BusinessInfoForm />}
      </div>
    </div>
  );
};