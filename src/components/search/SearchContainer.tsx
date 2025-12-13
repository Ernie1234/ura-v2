// src/components/search/SearchContainer.tsx (Revised)
import React, { useState, useRef, useEffect } from 'react';
import SearchInputOverlay from './SearchInputOverlay';
import SearchResults from './SearchResults';
import { useLocation } from 'react-router-dom';

type SearchState = 'initial' | 'results' | 'filters';

interface SearchContainerProps {
    isSearchOpen: boolean;
    onClose: () => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ isSearchOpen, onClose }) => {
    const [searchState, setSearchState] = useState<SearchState>('initial');
    const [currentQuery, setCurrentQuery] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Reset state when the container is opened
    useEffect(() => {
        if (isSearchOpen) {
            setSearchState('initial');
            setCurrentQuery('');
        }
    }, [isSearchOpen]);

    if (!isSearchOpen) return null;

    const handleSearchSubmit = (query: string) => {
        setCurrentQuery(query);
        setSearchState('results');
    };

    const handleBack = () => {
        if (searchState === 'results') {
            setSearchState('initial');
        } else {
            // If on the initial screen, close the entire search overlay
            onClose();
        }
    };
    
    const handleFilterToggle = () => {
        setSearchState(prev => prev === 'filters' ? 'results' : 'filters');
    };

    let ContentComponent;
    if (searchState === 'initial') {
        ContentComponent = (
            <SearchInputOverlay 
                onBack={handleBack} 
                onSearchSubmit={handleSearchSubmit} 
                onFilterToggle={handleFilterToggle} 
            />
        );
    } else {
        ContentComponent = (
            <SearchResults
                query={currentQuery}
                onBack={handleBack}
                onFilterToggle={handleFilterToggle}
                isFilterVisible={searchState === 'filters'}
            />
        );
    }

    // Function to handle clicking outside the content area (Desktop only)
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if the click occurred directly on the overlay backdrop
        if (e.target === e.currentTarget && window.innerWidth >= 1024) { // 1024px is Tailwind's 'lg' breakpoint
            onClose();
        }
    };

    return (
        // FIX 1: Desktop uses fixed backdrop (bg-black/40), Mobile uses full opaque white
        <div 
            className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 
                       bg-white lg:bg-black/40" 
            onClick={handleOverlayClick}
        >
            
            {/* FIX 2: Mobile View (Full Screen, No Background Context) */}
            {/* The content component renders full screen on mobile, managed by its own padding */}
            <div className="lg:hidden h-full">
                {ContentComponent}
            </div>

            {/* FIX 1: Desktop View (Modal/Overlay on top of darkened Dashboard) */}
            <div className="hidden lg:flex justify-center items-start pt-16 h-full">
                {/* The key to making the current page visible is setting the 
                  background to a translucent color and centering the content.
                  max-w-4xl makes the search window fit the design.
                */}
                <div 
                    ref={contentRef} 
                    className="max-w-4xl w-full mx-auto"
                    // Prevent closing the modal when clicking inside the content box
                    onClick={(e) => e.stopPropagation()} 
                >
                    {/* The content component, which now renders the white, rounded box */}
                    {ContentComponent}
                </div>
            </div>
        </div>
    );
};

export default SearchContainer;