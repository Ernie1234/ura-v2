// src/components/profile/ProfileTabs.tsx
import React from "react";

type Props = {
  active: string;
  onChange: (t: string) => void;
};

const tabs = ["All Posts", "About", "Products", "Reviews"];

const ProfileTabs: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="mt-2 border-b">
      <nav className="flex gap-6 lg:gap-12 px-6 md:px-10">
        {tabs.map((t) => {
          // Hide "About" on desktop
          const isAbout = t === "About";

          const isActive = t === active;

          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`
                py-3 relative -mb-px
                ${isActive ? "text-orange-500 font-semibold" : "text-gray-600"}
                ${isAbout ? "block lg:hidden" : ""}
              `}
            >
              {t}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-orange-400" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;
