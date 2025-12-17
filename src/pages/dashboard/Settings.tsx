import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User, ShieldCheck, Bell, Briefcase, Share2, Palette, Trash2, Settings } from "lucide-react";
import { useAuthContext } from "@/context/auth-provider";
import PersonalInfoForm from "@/components/settings/form/PersonalInfoForm";
import BusinessInfoForm from "@/components/settings/form/BusinessInfoForm";

const SettingsPage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<string | null>(null); // null means "show menu" on mobile

  const menuItems = [
    { id: "profile", label: "Public Profile", icon: User, desc: "Photos, Name, Bio", group: "User" },
    { id: "account", label: "Account Security", icon: ShieldCheck, desc: "Password, Email", group: "User" },
    ...(user?.isBusinessOwner ? [
      { id: "business", label: "Business Info", icon: Briefcase, desc: "Address, Category, Hours", group: "Business" },
      { id: "socials", label: "Social Links", icon: Share2, desc: "WhatsApp, Instagram", group: "Business" }
    ] : []),
    { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme, Display", group: "Preferences" },
  ];

  // Logic to handle back button on mobile
  const handleBack = () => setActiveTab(null);

  return (
    <div className="min-h-screen bg-[#fcfcfd] lg:py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        
        {/* Mobile Header: Only shows when a tab is active */}
        {activeTab && (
          <div className="lg:hidden flex items-center gap-4 py-6">
            <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
        )}

        {/* Desktop Header: Always shows */}
        <div className="hidden lg:block mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT COLUMN: The Menu (Always visible on desktop, hidden on mobile if tab active) */}
          <aside className={`w-full lg:w-72 shrink-0 ${activeTab ? "hidden lg:block" : "block"}`}>
            <div className="space-y-8">
              {/* Profile Summary Card (matches your uploaded design) */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 lg:hidden">
                 <img src={user?.profilePicture} className="w-16 h-16 rounded-full object-cover" alt="" />
                 <div>
                    <h3 className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                 </div>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      activeTab === item.id 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-100" 
                        : "bg-white border border-transparent hover:border-gray-200 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${activeTab === item.id ? "bg-white/20" : "bg-orange-50 text-orange-500"}`}>
                        <item.icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className={`text-xs ${activeTab === item.id ? "text-orange-100" : "text-gray-400"}`}>{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className={activeTab === item.id ? "opacity-100" : "opacity-30"} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: The Content (Hidden on mobile if no tab selected) */}
          <main className={`flex-1 ${!activeTab ? "hidden lg:block" : "block"}`}>
            <div className="bg-white rounded-[32px] lg:border border-gray-100 lg:shadow-sm min-h-[500px]">
              {!activeTab ? (
                <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-400 p-20">
                  <div className="p-6 bg-gray-50 rounded-full mb-4">
                    <Settings size={48} className="opacity-20" />
                  </div>
                  <p className="font-medium text-lg">Select a category to manage settings</p>
                </div>
              ) : (
                <>
                  {activeTab === "profile" && <PersonalInfoForm />}
                  {activeTab === "business" && <BusinessInfoForm />}
                  {/* ... other forms ... */}
                </>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;