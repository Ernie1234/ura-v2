// src/components/dashboard/DashboardContainer.tsx
import React from 'react';

interface DashboardContainerProps {
  leftColumn?: React.ReactNode;
  children: React.ReactNode;
  rightColumn?: React.ReactNode;
}

const DashboardContainer = ({ 
  leftColumn, 
  children, 
  rightColumn 
}: DashboardContainerProps) => {
  // Logic to calculate how wide the middle column should be
  let mainColSpan = "lg:col-span-4"; // Default full width
  if (leftColumn && rightColumn) mainColSpan = "lg:col-span-2";
  else if (leftColumn || rightColumn) mainColSpan = "lg:col-span-3";

return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN */}
        {leftColumn && (
          <aside className="space-y-6 lg:col-span-1 hidden lg:block">
            {leftColumn}
          </aside>
        )}

        {/* MAIN FEED */}
        <main 
          id="main-feed-container" 
          className={`space-y-6 flex flex-col max-h-[calc(100vh-2rem)] overflow-y-auto pr-2 ${mainColSpan}`}
          /* pr-2 adds a little gap so the scrollbar doesn't touch the post cards */
        >
          {children}
        </main>

        {/* RIGHT COLUMN */}
        {rightColumn && (
          <aside className="space-y-6 lg:col-span-1 hidden lg:block">
            {rightColumn}
          </aside>
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;