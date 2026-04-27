'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import staticData from '../src/data/completeData.json';

const ContentContext = createContext<any>(staticData);

export const ContentProvider = ({ children, initialData }: { children: React.ReactNode, initialData?: any }) => {
  const [content, setContent] = useState<any>(initialData || staticData);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    // If we already have initialData (e.g. from a page override), we don't necessarily need to fetch global
    // But usually we want to merge them. For now, let's just fetch if no initialData is provided
    // or if we want to ensure global defaults are always available.
    
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const globalData = await response.json();
          // Merge logic: local data takes precedence
          setContent(initialData ? { ...globalData, ...initialData } : globalData);
        }
      } catch (error) {
        console.error('Failed to fetch content from DB, falling back to static data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [initialData]);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
