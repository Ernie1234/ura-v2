// src/components/bookmark/MerchantList.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Search, Star } from 'lucide-react';
import type { MerchantBookmark } from '@/types/bookmark';
// Assuming mockApi is imported correctly
import { mockApi } from '@/services/mockApi';

// Define a type for the shape of the data we expect from the API
interface BookmarkMerchantsResponse {
    merchants: MerchantBookmark[];
}

const MerchantList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // Use state to manage the data loaded asynchronously
    const [mockMerchants, setMockMerchants] = useState<MerchantBookmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMerchants = async () => {
            setIsLoading(true);
            // Use the mockApi service to fetch the data
            const data = await mockApi.get('bookmark') as BookmarkMerchantsResponse | null;

            if (data && data.merchants) {
                setMockMerchants(data.merchants as MerchantBookmark[]);
            }
            setIsLoading(false);
        };
        fetchMerchants();
    }, []); // Run once on component mount

    const filteredMerchants = mockMerchants.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-0">

            {/* Search Bar - Visible on Mobile, integrated on Desktop */}
            <div className="relative mb-6 lg:mb-8">
                <input
                    type="text"
                    placeholder="Search Saved Users"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Loading users...</div>
            ) : (
                <div className="space-y-4">
                    {filteredMerchants.map((merchant) => (
                        <div
                            key={merchant.id}
                            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={merchant.profileImageUrl}
                                    alt={merchant.name}
                                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{merchant.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 my-0.5">
                                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                                        <span>{merchant.rating.toFixed(1)} ({merchant.reviewCount} reviews)</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600">
                                        <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                                        <span>{merchant.address}</span>
                                    </div>
                                    <p className="text-sm italic text-gray-500 mt-1 hidden sm:block">{merchant.snippet}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    ))}
                    {filteredMerchants.length === 0 && (
                        <p className="text-center text-gray-500 py-10">
                            {searchTerm ? 'No saved users match your search.' : 'You have no saved users.'}
                        </p>
                    )}
                </div>
            )}
    </div>
    );
};

export default MerchantList;