/**
 * LibraryContext.jsx — Context for Rights Library feature
 * Manages search, filters, and shared state across library pages.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ articles: [], categories: [] });
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setSearchResults({ articles: [], categories: [] });
      setSearchOpen(true);
    } else {
      setSearchResults({ articles: [], categories: [] });
      setSearchOpen(false);
    }
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults({ articles: [], categories: [] });
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        searchQuery,
        searchResults,
        searchOpen,
        handleSearch,
        closeSearch,
        setSearchOpen,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
