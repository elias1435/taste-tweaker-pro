import { useState, useEffect, useCallback } from 'react';
import type { MenuData } from '@/types/menu';
import { menuData as staticMenuData } from '@/data/menuData';
import { fetchWordPressMenu, isWordPressEnabled, clearMenuCache } from '@/services/wordpressApi';

interface UseMenuDataResult {
  menuData: MenuData;
  isLoading: boolean;
  error: string | null;
  source: 'static' | 'wordpress';
  refresh: () => Promise<void>;
}

export function useMenuData(): UseMenuDataResult {
  const [menuData, setMenuData] = useState<MenuData>(staticMenuData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'static' | 'wordpress'>('static');

  const fetchData = useCallback(async () => {
    // Skip if WordPress is not configured
    if (!isWordPressEnabled()) {
      setMenuData(staticMenuData);
      setSource('static');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const wpData = await fetchWordPressMenu();
      setMenuData(wpData);
      setSource('wordpress');
    } catch (err) {
      console.warn('Failed to fetch from WordPress, using static data:', err);
      setMenuData(staticMenuData);
      setSource('static');
      setError(err instanceof Error ? err.message : 'Failed to fetch menu data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh function that clears cache and refetches
  const refresh = useCallback(async () => {
    clearMenuCache();
    await fetchData();
  }, [fetchData]);

  return {
    menuData,
    isLoading,
    error,
    source,
    refresh,
  };
}
