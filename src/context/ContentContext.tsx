'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import staticData from '../src/data/completeData.json';

const ContentContext = createContext<any>(staticData);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<any>(staticData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch content from DB, falling back to static data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
