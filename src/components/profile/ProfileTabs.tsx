// src/components/profile/ProfileTabs.tsx
import React from "react";

type Props = {
  active: string;
  onChange: (t: string) => void;
  isBusiness?: boolean; // Add this prop
};

const ProfileTabs: React.FC<Props> = ({ active, onChange, isBusiness }) => {
  // Filter tabs: only include "Products" if isBusiness is true
  const availableTabs = ["Feeds", "Posts", "Products", "About", "Reviews"].filter(tab => {
    if (tab === "Products") return isBusiness;
    return true;
  });

  return (
    <div className="mt-2 border-b">
      <nav className="flex gap-6 lg:gap-12 px-6">
        {availableTabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`py-3 relative -mb-px transition-colors ${
              active === t ? "text-orange-500 font-semibold" : "text-gray-500 hover:text-gray-700"
            } ${t === "About" ? "block lg:hidden" : ""}`}
          >
            {t}
            {active === t && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-orange-500" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;
