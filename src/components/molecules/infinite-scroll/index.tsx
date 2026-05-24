'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useRef } from 'react';

export interface InfiniteScrollProps {
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  label?: string;
  children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  isLoading,
  hasNextPage,
  onLoadMore,
  label = 'data',
  children,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const t = useTranslations('Dashboard');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isLoading, onLoadMore]);

  return (
    <div className="flex flex-col">
      {children}
      <div ref={observerTarget} className="py-4 mt-2 flex justify-center items-center">
        {isLoading && hasNextPage && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-5 w-5 text-primary-default" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{t('loading') || 'Loading...'}</span>
          </div>
        )}
        {!hasNextPage && (
          <div className="text-sm text-gray-500 text-center">
            {t('allDataDisplayed', { label })}
          </div>
        )}
      </div>
    </div>
  );
};
