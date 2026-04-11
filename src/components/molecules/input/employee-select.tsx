'use client';

import { ISearchUser, useSearchUser } from '@/shared/hooks/use-search-user';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { InputTextSearch } from './search';

export interface EmployeeSelectProps {
  /**
   * Controlled selected user.
   * If provided, the component displays the selected state.
   * If null/undefined, it displays the search input.
   */
  selectedUser?: {
    employeeId: string;
    fullName: string;
    email?: string;
  } | null;
  /**
   * Callback when a user is selected or cleared.
   * Returns null if cleared.
   */
  onChange: (user: ISearchUser | null) => void;
  /**
   * Label for the field
   */
  label?: string;
  /**
   * Placeholder for the search input
   */
  placeholder?: string;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Whether the field is required (adds asterisk to label)
   */
  required?: boolean;
  /**
   * API Endpoint for search
   */
  endpoint?: string;
  /**
   * Helper text to display below input
   */
  helperText?: string;
  /**
   * Optional external search results
   */
  customSearchResults?: ISearchUser[] | null;
  /**
   * Optional external loading state
   */
  isSearchingExternal?: boolean;
  /**
   * Optional manual search handler
   */
  onSearchQueryChange?: (query: string) => void;
  /**
   * Whether the field has been touched
   */
  isTouched?: boolean;
}

export const EmployeeSelect = ({
  selectedUser,
  onChange,
  label = 'Search Employee',
  placeholder = 'Search by name, employee ID, or email...',
  errorMessage,
  required = false,
  endpoint,
  helperText,
  customSearchResults,
  isSearchingExternal,
  onSearchQueryChange,
  isTouched,
}: EmployeeSelectProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Internal search hook (used if no external search provided)
  const { data: internalSearchResults, isLoading: isSearchingInternal } = useSearchUser({
    query: debouncedSearchQuery,
    enabled: !onSearchQueryChange && !!debouncedSearchQuery,
    endpoint,
  });

  const searchResults =
    customSearchResults !== undefined ? customSearchResults : internalSearchResults;
  const isSearching = isSearchingExternal !== undefined ? isSearchingExternal : isSearchingInternal;

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    if (onSearchQueryChange) {
      onSearchQueryChange(value);
    }
  };

  // Clear search query when a user is selected to reset the view if they deselect later
  useEffect(() => {
    if (selectedUser) {
      setSearchQuery('');
    }
  }, [selectedUser]);

  return (
    <div className="grid gap-2">
      {label && (
        <label>
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}

      {!selectedUser ? (
        <div className="relative">
          <InputTextSearch
            search={searchQuery}
            setSearch={(value) => handleQueryChange(value || '')}
            placeholder={placeholder}
            useSuggestion={true}
            loadingSuggestion={isSearching}
            suggestionEmptyState="No users found"
            suggestionLoadingState="Searching users..."
            delayDebounce={500}
            size="md"
            className="w-full"
          >
            {searchResults && searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto w-full">
                {searchResults.map((user) => (
                  <button
                    key={user.employeeId}
                    type="button"
                    onClick={() => {
                      onChange(user);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">ID: {user.employeeId}</span>
                          {user.orgUnit && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-400">{user.orgUnit.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Plus className="h-5 w-5 text-primary-600 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </InputTextSearch>
          {errorMessage && isTouched && (
            <p className="mt-1 text-xs text-danger-500">{errorMessage}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{selectedUser.fullName}</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-gray-500 truncate">ID: {selectedUser.employeeId}</p>
                {selectedUser.email && (
                  <p className="text-xs text-gray-400 truncate">{selectedUser.email}</p>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="h-8 w-8 text-gray-400 hover:text-danger-500 cursor-pointer shrink-0 flex items-center justify-center transition-colors rounded-full hover:bg-gray-100"
            aria-label="Remove selected employee"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {helperText && !errorMessage && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};
