// src/components/CreationDashboard.tsx
import React, { useState } from 'react';
import UploadProductForm from '@/components/product/UploadProductForm';
import MakePostForm from '@/components/product/MakePostForm';

// Assuming ProfileCard and ChatList are imported correctly
import ProfileCard from '@/components/dashboard/ProfileCard'; 
import ChatList from '@/components/dashboard/ChatList'; 
import { useAuthContext } from '@/context/auth-provider';

const CreateProduct: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'product' | 'post'>('product');

    const { user, related, isLoading: isContextLoading } = useAuthContext();

  return (
    // Mobile padding added here: px-4. Background color changed to white for mobile content area.
    <div className="min-h-screen bg-[#FFF9F6] lg:py-8 px-0 sm:px-4"> 
      
      <div className="mx-auto max-w-7xl lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SIDEBAR (Desktop Only) */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <ProfileCard user={user} related={related} />
          {/* <ChatList user={user} /> */}
        </aside>

        {/* Right Column (Content Area) - Takes up full width on mobile (col-span-1) */}
        <div className="space-y-6 lg:col-span-3 flex flex-col bg-white lg:rounded-xl lg:shadow-xl">
          
          {/* Tabs: Unified responsive structure */}
          <div className="flex border-b  lg:p-4">
            <button
              onClick={() => setActiveTab('product')}
              // Adjusted text size to 'base' for mobile/desktop tabs
              className={`flex-1 lg:flex-none py-3 lg:px-4 text-base lg:text-lg font-semibold transition-colors ${
                activeTab === 'product'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload Product
            </button>
            <button
              onClick={() => setActiveTab('post')}
              // Adjusted text size to 'base' for mobile/desktop tabs
              className={`flex-1 lg:flex-none py-3 lg:px-4 text-base lg:text-lg font-semibold transition-colors ${
                activeTab === 'post'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Make a Post
            </button>
          </div>
          
          {/* Form Content: Mobile padding added directly to the forms for control */}
          <div className="lg:p-8 pt-0 lg:pt-2">
             {activeTab === 'product' ? <UploadProductForm /> : <MakePostForm />}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CreateProduct;