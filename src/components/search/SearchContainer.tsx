// src/components/search/SearchContainer.tsx
import React, { useState, useEffect } from 'react';
import { SearchInputOverlay } from './SearchInputOverlay';
import SearchResults from './SearchResults';
import { useSearch, useSearchHistory } from '@/hooks/api/use-search';
import { useNavigate } from 'react-router-dom';

type SearchType = 'all' | 'user' | 'business' | 'post' | 'product';

const SearchContainer: React.FC<{ isSearchOpen: boolean; onClose: () => void }> = ({ isSearchOpen, onClose }) => {
    const [searchState, setSearchState] = useState<'initial' | 'results'>('initial');
    const [query, setQuery] = useState('');
    const [activeType, setActiveType] = useState<SearchType>('all');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // ADD THIS: Lift filters state up from SearchResults
    const [filters, setFilters] = useState<any>({});

    // Pass the lifted filters into the hook
    const { results, isLoading } = useSearch(query, activeType, filters);
    const { history, deleteItem, clearAll, addToHistory, refreshHistory } = useSearchHistory();

    const navigate = useNavigate(); // Initialize navigate
    // ... your other states (query, activeType, etc.)

    
    // Reset when modal opens
    useEffect(() => {
        if (isSearchOpen) {
            setSearchState('initial');
            setQuery('');
            setFilters({}); // Reset filters when opening fresh
            refreshHistory();
        }
    }, [isSearchOpen]);

    // 2. Trigger result view when user clicks a history item or types
    const handleSearchSubmit = (searchQuery: string) => {
        setQuery(searchQuery);
        setSearchState('results'); // Switch view to show SearchResults
    };

    const handleResultClick = async (itemQuery: string, targetUrl: string) => {
        // 1. Save to history first
        await addToHistory(itemQuery);

        // 2. Close the search modal/overlay
        onClose();

        // 3. Navigate to the profile/product/post
        navigate(targetUrl);
    };

    if (!isSearchOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white lg:bg-black/40">
            <div className="lg:max-w-4xl lg:mx-auto lg:pt-16 h-full min-h-screen">
                {searchState === 'initial' ? (
                    <SearchInputOverlay
                        query={query}
                        setQuery={(q) => {
                            setQuery(q);
                            // Optional: Switch to results automatically after 3 characters
                            if (q.length > 2) setSearchState('results');
                        }}
                        history={history}
                        onDeleteHistory={deleteItem}
                        onClearAll={clearAll}
                        onBack={onClose}
                        onSearchSubmit={handleSearchSubmit}
                    />
                ) : (
                    <SearchResults
                        query={query}
                        setQuery={setQuery}
                        results={results}
                        isLoading={isLoading}
                        activeType={activeType}
                        setActiveType={setActiveType}
                        onBack={() => setSearchState('initial')}
                        onResultClick={handleResultClick}
                        onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
                        isFilterVisible={isFilterVisible}
                        // ADD THESE PROPS
                        filters={filters}
                        setFilters={setFilters}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchContainer;