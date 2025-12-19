import React, { useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/auth-provider';
import UploadProductForm from '@/components/product/UploadProductForm';
import MakePostForm from '@/components/product/MakePostForm';
import ProfileCard from '@/components/dashboard/ProfileCard';
import SidebarWidget from '@/components/dashboard/SidebarWidget';
import { PackagePlus, Megaphone, Info, Sparkles } from 'lucide-react';

const CreateProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, related, isLoading } = useAuthContext();
  
  const activeTab = searchParams.get('type') || 'post';
  const isBusiness = user?.isBusinessOwner;

  useEffect(() => {
    if (activeTab === 'product' && !isBusiness) {
      setSearchParams({ type: 'post' });
    }
  }, [activeTab, isBusiness, setSearchParams]);

  if (isLoading) return null; // Or your DashboardSkeleton
  if (!user || !related) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SIDEBAR - Reusing your ProfileCard for consistency */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <ProfileCard user={user} related={related} />
          
          <SidebarWidget isDesktop={true} isError={false} errorTitle={''}>
            <div className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-orange-600" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Posts with **high-quality images** receive 3x more engagement.
                </p>
              </div>
            </div>
          </SidebarWidget>
        </aside>

        {/* MAIN COLUMN - Swapping Feed for Form */}
        <main className="space-y-6 lg:col-span-2 flex flex-col">
          
          {/* Tabs styled like your ShareBox/Dashboard elements */}
          <div className="bg-white p-1.5 rounded-[24px] shadow-sm border border-gray-100 flex items-center">
            {isBusiness && (
              <button
                onClick={() => setSearchParams({ type: 'product' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-sm font-bold transition-all ${
                  activeTab === 'product' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <PackagePlus size={18} />
                <span>List Product</span>
              </button>
            )}

            <button
              onClick={() => setSearchParams({ type: 'post' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-sm font-bold transition-all ${
                activeTab === 'post' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Megaphone size={18} />
              <span>Make a Post</span>
            </button>
          </div>

          {/* Form Content - Matches the width of your Feed cards */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="mb-6">
               <h2 className="text-xl font-black text-gray-900">
                 {activeTab === 'product' ? 'Product Information' : 'New Update'}
               </h2>
               <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                 Fill in the details below to publish
               </p>
            </div>
            
            {activeTab === 'product' ? <UploadProductForm /> : <MakePostForm />}
          </div>
        </main>

        {/* RIGHT SIDEBAR - Keeping the layout balance */}
        <aside className="space-y-6 lg:col-span-1 hidden lg:block">
          <SidebarWidget isDesktop={true} isError={false} errorTitle={''}>
            <div className="p-5">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                  <Info size={16} className="text-orange-500" />
                  <span className="text-sm">Visibility</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Product listings appear in the Shop and are searchable by all users. 
                  Normal posts appear on your followers' feeds.
                </p>
              </div>
            </div>
          </SidebarWidget>
          
          <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] text-white">
             <h4 className="font-black text-sm mb-1">Sell Faster</h4>
             <p className="text-[10px] opacity-90 leading-normal">
               Tag your products in your posts to let customers buy directly from their feed.
             </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CreateProduct;