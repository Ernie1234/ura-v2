// src/components/bookmark/PostGrid.tsx
import React, { useState, useEffect } from 'react';
import { Heart, Camera, Search } from 'lucide-react';
import type { PostBookmark } from '@/types/bookmark';
// Assuming mockApi is imported correctly
import { mockApi } from '@/services/mockApi'; 

// Define a type for the shape of the data we expect from the API
interface BookmarkPostsResponse {
    posts: PostBookmark[];
}

// Reusable Post Card (Simplified)
const PostCard: React.FC<PostBookmark> = ({ name, merchant, image, photoCount, likes }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
    <div className="relative w-full aspect-[3/4]">
      <img src={image} alt={name} className="w-full h-full object-cover" />
      
      {/* Footer overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold text-white truncate">{name}</h4>
          <p className="text-xs text-gray-200">{merchant}</p>
        </div>
        <div className="flex items-center space-x-3 text-white">
          <span className="flex items-center text-xs">
            <Camera className="w-3 h-3 mr-1" /> {photoCount}
          </span>
          <span className="flex items-center text-xs">
            <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" /> {likes}
          </span>
        </div>
      </div>
    </div>
  </div>
);


const PostGrid: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // Use state to manage the data loaded asynchronously
    const [mockPosts, setMockPosts] = useState<PostBookmark[]>([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            // Use the mockApi service to fetch the data
            const data = await mockApi.get('bookmark'); 
            
            if (data && data.posts) {
                setMockPosts(data.posts as PostBookmark[]);
            }
            setIsLoading(false);
        };
        fetchPosts();
    }, []); // Run once on component mount

    const filteredPosts = mockPosts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-0">
            {/* Search Bar - Integrated into the tab content */}
            <div className="relative mb-6 lg:mb-8">
                <input
                    type="text"
                    placeholder="Search Saved Posts"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Loading posts...</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredPosts.map(post => (
                            <PostCard key={post.id} {...post} />
                        ))}
                    </div>
                    {filteredPosts.length === 0 && (
                        <p className="text-center text-gray-500 py-10">
                            {searchTerm ? 'No saved posts match your search.' : 'You have no saved posts.'}
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default PostGrid;