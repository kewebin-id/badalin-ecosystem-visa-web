'use client';

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  Select as SelectOriginal,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Spinner,
} from '@/components/atoms';
import styles from '@/shared/styles/components/input.module.css';
import { cn } from '@/shared/utils';
import { RestAPI } from '@/shared/utils/rest-api';
import { ResponseRESTPagination } from '@/shared/utils/rest-api/types';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export interface IVendor {
  id: number;
  name: string;
  code?: string;
}

export interface InputSelectAsyncProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  value?: string | number;
  setValue?: (value: string | number | undefined, option?: IVendor | object) => void;
  required?: boolean;
  isLoading?: boolean;
  endpoint: string;
  searchKey?: string; // Key untuk search di API (default: 'search')
  limit?: number; // Limit per page (default: 5)
  getOptionLabel?: (item: IVendor) => string;
  getOptionValue?: (item: IVendor) => string | number;
  isTouched?: boolean;
}

export const InputSelectAsync: FC<InputSelectAsyncProps> = ({
  className,
  size = 'lg',
  disabled,
  placeholder = 'Select...',
  label,
  errorMessage,
  value,
  setValue,
  required,
  isLoading: externalLoading,
  endpoint,
  searchKey = 'search',
  limit = 5,
  getOptionLabel = (item) => item.name,
  getOptionValue = (item) => item.id.toString(),
  isTouched,
}) => {
  const [inputState, setInputState] = useState<string | number | undefined>(value);
  const [opened, setOpened] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [options, setOptions] = useState<IVendor[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | undefined>(undefined);

  const restApi = useMemo(() => new RestAPI(), []);
  const lastProcessedValueRef = useRef<string | number | undefined>(undefined);

  // Load options
  const loadOptions = useCallback(
    async (pageNum: number = 1, search: string = '') => {
      setIsLoading(true);
      try {
        const queryParam: Record<string, unknown> = {
          page: pageNum,
          limit,
          [searchKey]: search || undefined,
        };

        const result = await restApi.get<ResponseRESTPagination<IVendor>>({
          endpoint,
          queryParam,
          isNextApi: true,
        });

        if (result.data) {
          if (pageNum === 1) {
            setOptions(result.data.data || []);
          } else {
            setOptions((prev) => [...prev, ...(result?.data?.data || [])]);
          }
          const totalPages = Math.ceil(
            (result.data.meta?.total || 0) / (result.data.meta?.limit || 1),
          );
          setHasMore((result.data.meta?.page || 0) < totalPages);
        }
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    },
    [endpoint, limit, restApi, searchKey],
  );

  // Track previous debouncedSearch to prevent unnecessary reloads
  const prevDebouncedSearchRef = useRef<string>('');

  // Load when search changes (debounced) - hanya jika dropdown terbuka dan search benar-benar berubah
  useEffect(() => {
    if (opened && debouncedSearch !== prevDebouncedSearchRef.current) {
      prevDebouncedSearchRef.current = debouncedSearch;
      setPage(1);
      setIsInitialLoading(true);
      loadOptions(1, debouncedSearch);
      setHasLoadedOnce(true);
    }
  }, [debouncedSearch, opened, loadOptions]);

  // Initial load only when dropdown opens for the first time and no search query
  // Hanya trigger jika belum pernah load dan tidak ada search query
  useEffect(() => {
    if (opened && !hasLoadedOnce && debouncedSearch === '' && !isLoading && !isInitialLoading) {
      prevDebouncedSearchRef.current = '';
      setIsInitialLoading(true);
      loadOptions(1, '');
      setHasLoadedOnce(true);
    }
  }, [opened, hasLoadedOnce, debouncedSearch, isLoading, isInitialLoading, loadOptions]);

  // Sync inputState dengan value prop
  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setInputState(undefined);
      setSelectedOptionLabel(undefined);
    } else {
      setInputState(value);
    }
  }, [value]);

  // Load selected option if value exists but not in options
  useEffect(() => {
    const currentValue = inputState ?? value;
    if (currentValue) {
      const foundOption = options.find((opt) => getOptionValue(opt) === currentValue);
      if (foundOption) {
        // Update label if option is found
        setSelectedOptionLabel(getOptionLabel(foundOption));
      } else if (
        currentValue &&
        options.length === 0 &&
        !hasLoadedOnce &&
        !isLoading &&
        !isInitialLoading &&
        lastProcessedValueRef.current !== currentValue
      ) {
        // If value exists but options are empty, load initial options to find the selected value
        // This happens when value is set before dropdown is opened
        lastProcessedValueRef.current = currentValue;
        loadOptions(1, '');
        setHasLoadedOnce(true);
      }
    } else {
      setSelectedOptionLabel(undefined);
    }
  }, [
    value,
    inputState,
    options,
    isLoading,
    isInitialLoading,
    hasLoadedOnce,
    getOptionValue,
    getOptionLabel,
    loadOptions,
  ]);

  const onChange = (e: string) => {
    const selectedValue = e;
    setInputState(selectedValue);
    // Find and set label for selected option
    const selectedOption = options.find((opt) => getOptionValue(opt) === selectedValue);
    if (selectedOption) {
      setSelectedOptionLabel(getOptionLabel(selectedOption));
    }
    if (setValue) {
      setValue(selectedValue || undefined, selectedOption);
    }
  };

  const currentValue = inputState ?? value;
  const selectedOption = useMemo(
    () => options.find((opt) => getOptionValue(opt) === currentValue),
    [options, currentValue, getOptionValue],
  );

  // Use selectedOptionLabel if available, otherwise try to get from selectedOption
  const labelValue =
    selectedOptionLabel || (selectedOption ? getOptionLabel(selectedOption) : undefined);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10 &&
      hasMore &&
      !isLoading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(nextPage, debouncedSearch);
    }
  };

  if (externalLoading) {
    return <Skeleton className="h-[55px] w-full rounded-lg" />;
  }

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-black">
          {label}
          {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <SelectOriginal
        disabled={disabled}
        onOpenChange={(open) => {
          setOpened(open);
          if (!open) {
            // Reset search query dan flag saat dropdown ditutup
            setSearchQuery('');
            setHasLoadedOnce(false);
            prevDebouncedSearchRef.current = '';
            // Don't clear options if we have a selected value - we need them for display
            if (!currentValue) {
              setOptions([]);
            }
          } else {
            // When opening, ensure we have options loaded if value exists
            if (
              currentValue &&
              options.length === 0 &&
              !hasLoadedOnce &&
              !isLoading &&
              !isInitialLoading
            ) {
              loadOptions(1, '');
              setHasLoadedOnce(true);
            }
          }
        }}
        onValueChange={onChange}
        value={currentValue?.toString() ?? undefined}
      >
        <SelectTrigger
          icon={
            <ChevronDown
              className={cn(
                'transition-all duration-200',
                opened ? 'rotate-180' : '',
                size === 'lg' ? 'size-6' : size === 'md' ? 'size-5' : 'size-4',
              )}
            />
          }
          className={cn(
            styles[size],
            className,
            disabled
              ? 'cursor-not-allowed! bg-gray-100! border-gray-200!'
              : 'bg-white! text-black focus:border-primary-default border-gray-300',
            errorMessage ? styles['form-input-error'] : styles['form-input'],
            opened && 'input-focused',
          )}
        >
          <SelectValue placeholder={<span className="text-gray-500">{placeholder}</span>}>
            {currentValue && labelValue && <p>{labelValue}</p>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="overflow-hidden max-h-64 p-0">
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto" onScroll={handleScroll} style={{ maxHeight: '12rem' }}>
            {isInitialLoading ? (
              <div className="flex items-center justify-center py-4">
                <Spinner variant="primary" message="Loading..." />
              </div>
            ) : options.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-gray-500">No options found</div>
            ) : (
              <SelectGroup>
                {options
                  .map((option) => {
                    const optionValue = getOptionValue(option);
                    return { option, optionValue };
                  })
                  .filter(({ optionValue }) => {
                    const valueStr = optionValue.toString();
                    return valueStr !== '' && valueStr !== 'null' && valueStr !== 'undefined';
                  })
                  .map(({ option, optionValue }) => (
                    <SelectItem
                      key={optionValue}
                      className={styles[size]}
                      value={optionValue.toString()}
                    >
                      {getOptionLabel(option)}
                    </SelectItem>
                  ))}
                {isLoading && (
                  <div className="flex items-center justify-center py-2">
                    <Spinner variant="primary" message="Loading more..." />
                  </div>
                )}
              </SelectGroup>
            )}
          </div>
        </SelectContent>
      </SelectOriginal>
      {(errorMessage || isTouched) && (
        <p className="mt-1 flex items-center gap-1 text-sm text-danger-500">
          <AlertTriangle className="size-4 min-h-4 min-w-4 text-danger-500" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};
