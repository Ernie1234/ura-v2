// src/components/search/SearchResults.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { mockApi } from '@/services/mockApi';

// Type definitions (assuming MerchantBookmark is defined in types/bookmark.ts)
interface SearchResult {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    address: string;
    snippet: string;
    profileImageUrl: string;
}

// Sub-component for the Filters Panel (Mobile Modal or Desktop Sidebar)
const SearchFilters: React.FC<{ onFilterChange?: (filters: any) => void }> = () => (
    <div className="p-4 space-y-6 lg:p-0">
        <h3 className="text-xl font-bold text-gray-800 hidden lg:block mb-4">Filters</h3>

        {/* Categories */}
        <section>
            <h4 className="font-semibold text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
                {['Snacks & Street Food', 'Breakfast', 'Local Delicacies', 'Soups & Stews', 'Intercontinental', 'Staple'].map(cat => (
                    <button key={cat} className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 bg-gray-50 hover:bg-orange-50 hover:border-orange-500 transition-colors">
                        {cat}
                    </button>
                ))}
            </div>
        </section>

        {/* Service Options */}
        <section>
            <h4 className="font-semibold text-gray-700 mb-2">Service Options</h4>
            <div className="flex flex-wrap gap-2">
                {['Dine - In', 'Takeaway', 'Delivery'].map(opt => (
                    <button key={opt} className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-orange-50">
                        {opt}
                    </button>
                ))}
            </div>
        </section>

        {/* Open Now / Hours (Simplified) */}
        <section>
            <h4 className="font-semibold text-gray-700 mb-2">Open Now / Hours</h4>
            <div className="flex gap-2">
                {['Open Now', '24 Hours', 'Popular Times'].map(time => (
                    <button key={time} className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-orange-50">
                        {time}
                    </button>
                ))}
            </div>
        </section>
        
        {/* Distance, Rate, Price Range (Using design inputs) */}
        <section>
            <h4 className="font-semibold text-gray-700 mb-2">Distance</h4>
            <div className="flex items-center space-x-2">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full">-</button>
                <span className="text-base text-gray-700">2km</span>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full">+</button>
            </div>
        </section>

        <section>
            <h4 className="font-semibold text-gray-700 mb-2">Rate</h4>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className={`flex items-center justify-center w-8 h-8 border rounded-lg text-sm transition-colors ${star === 4 || star === 5 ? 'bg-orange-100 border-orange-500 text-orange-500' : 'border-gray-300 text-gray-500'}`}>
                        {star}<Star className={`w-3 h-3 ml-0.5 ${star === 4 || star === 5 ? 'fill-orange-500' : 'fill-gray-300'}`} />
                    </button>
                ))}
            </div>
        </section>
        
        <section>
            <h4 className="font-semibold text-gray-700 mb-2">Price Range</h4>
            <div className="flex items-center space-x-2">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full">-</button>
                <span className="text-base text-gray-700">₦500</span>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full">+</button>
            </div>
        </section>
    </div>
);


interface SearchResultsProps {
    query: string;
    onBack: () => void;
    onFilterToggle: () => void;
    isFilterVisible: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, onBack, onFilterToggle, isFilterVisible }) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            // Simulate fetching results based on the search type (e.g., 'Restaurants')
            const data = await mockApi.get('searchResults/restaurants');
            if (data && data.results) {
                setResults(data.results as SearchResult[]);
            }
            setIsLoading(false);
        };
        fetchResults();
    }, [query]);

    // The results list item component
    const ResultItem: React.FC<SearchResult> = (item) => (
        <div className="flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0">
            <img 
                src={item.profileImageUrl} 
                alt={item.name} 
                className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0" 
            />
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <div className="flex items-center text-sm text-gray-500 my-0.5">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                    <span>{item.rating.toFixed(1)} ({item.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                    <span>{item.address}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{item.snippet} <span className="text-orange-500 font-medium">See more</span></p>
            </div>
        </div>
    );


    return (
        <div className="w-full min-h-screen bg-white lg:min-h-0 lg:rounded-xl lg:shadow-xl">
            
            {/* Header/Search Input - Unified across mobile/desktop */}
            <div className="flex items-center space-x-2 p-4 lg:p-6 border-b lg:border-none">
                <button onClick={onBack} className="p-1 text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-grow relative">
                    <input
                        type="text"
                        defaultValue={query} // Display current query
                        placeholder="Restaurants"
                        className="w-full py-3 pl-4 pr-16 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 text-base"
                    />
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
                <button onClick={onFilterToggle} className="p-1 text-gray-600 hover:text-gray-900 lg:hidden">
                    <SlidersHorizontal className="w-6 h-6" /> {/* Filter Icon visible on mobile */}
                </button>
            </div>
            
            {/* Main Content: Filters + Results */}
            <div className="lg:grid lg:grid-cols-4 lg:gap-8 lg:p-6">
                
                {/* Desktop Filters (Left Column) - image_691f72.jpg */}
                <div className="lg:col-span-1 hidden lg:block border-r lg:pr-6">
                    <SearchFilters />
                </div>

                {/* Results List (Right Columns) */}
                <div className="lg:col-span-3">
                    <h2 className="text-xl font-bold text-gray-800 p-4 lg:p-0 mb-4">
                        Search Results for <span className="text-orange-500">{query}</span>
                    </h2>
                    
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">Searching for results...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {results.map(item => <ResultItem key={item.id} {...item} />)}
                            {results.length === 0 && (
                                <p className="text-center text-gray-500 py-10">No results found for "{query}".</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal (if isFilterVisible is true) */}
            {isFilterVisible && (
                <div className="fixed inset-0 z-40 bg-white lg:hidden overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={onFilterToggle} className="p-2 text-gray-600">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <SearchFilters />
                    <div className="p-4 border-t sticky bottom-0 bg-white">
                        <button 
                            className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                            onClick={onFilterToggle} // Close modal/Apply button action
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;