import React from "react";

type Props = {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
  isBusiness?: boolean;
};

const ProfileTabs: React.FC<Props> = ({ tabs, active, onChange, isBusiness }) => {
  // Filter logic: 
  // 1. "Products" and "Reviews" only show for Businesses.
  // 2. "Following" only shows for normal Users (Businesses usually have Followers but don't 'Follow' back in many UI patterns, or you can keep it if preferred).
  const availableTabs = tabs.filter(tab => {
    if (tab === "Products" || tab === "Reviews") return isBusiness;
    if (tab === "Following") return !isBusiness; // Remove following from business profiles
    return true;
  });

  return (
    <div className="mt-2 border-b border-gray-100">
      {/* HORIZONTAL SCROLL LOGIC:
          - overflow-x-auto: Allows scrolling
          - scrollbar-hide: (Optional) custom utility to hide bar
          - whitespace-nowrap: Prevents tabs from wrapping to new lines
      */}
      <nav className="flex gap-6 lg:gap-12 px-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        {availableTabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`py-3 relative transition-colors flex-shrink-0 ${
              active === t 
                ? "text-orange-500 font-bold" 
                : "text-gray-500 hover:text-gray-900 font-medium"
            } ${t === "About" ? "block lg:hidden" : ""}`}
          >
            {t}
            {active === t && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;