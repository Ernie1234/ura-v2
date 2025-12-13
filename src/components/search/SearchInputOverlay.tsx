// src/components/search/SearchInputOverlay.tsx
import React, { useState } from 'react';
import { ArrowLeft, History, Camera, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

// Mock Recent Searches Data
const recentSearches = [
    "Hair Salon",
    "Fashion Designer",
    "Auto repair shops",
    "nightlife and bars with ratings",
    "Chinese restaurants",
];

interface SearchInputOverlayProps {
    onBack: () => void;
    onSearchSubmit: (query: string) => void;
    // Add prop to handle filter toggle, since the icon is present
    onFilterToggle: () => void; 
    initialQuery?: string;
}

const SearchInputOverlay: React.FC<SearchInputOverlayProps> = ({ onBack, onSearchSubmit, onFilterToggle, initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearchSubmit(query.trim());
        }
    };

    return (
        <div className="w-full h-full bg-white lg:rounded-xl lg:shadow-xl lg:p-6 p-4">
            
            {/* Search Bar - Responsive and unified */}
            <div className="flex items-center space-x-2 mb-8">
                <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <form onSubmit={handleSubmit} className="flex-grow relative">
                    <input
                        type="text"
                        placeholder="Search businesses, products, or services..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full py-3 pl-4 pr-24 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 text-base"
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                            <Camera className="w-5 h-5" /> {/* Picture Search Icon */}
                        </button>
                        <button type="submit" className="p-2 text-gray-500 hover:text-gray-700">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
                <button onClick={onFilterToggle} className="p-2 text-gray-600 hover:text-gray-900">
                    <SlidersHorizontal className="w-6 h-6" /> {/* Filter Icon */}
                </button>
            </div>

            {/* Recent Searches */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h3>
            <div className="space-y-3">
                {recentSearches.map((term, index) => (
                    <button
                        key={index}
                        onClick={() => onSearchSubmit(term)}
                        className="flex items-center space-x-3 text-gray-600 hover:text-orange-500 w-full text-left py-1"
                    >
                        <History className="w-5 h-5 flex-shrink-0" />
                        <span className="text-base">{term}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchInputOverlay;