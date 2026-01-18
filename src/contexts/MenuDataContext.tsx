import { createContext, useContext, type ReactNode } from 'react';
import type { MenuData } from '@/types/menu';
import { useMenuData } from '@/hooks/useMenuData';

interface MenuDataContextValue {
  menuData: MenuData;
  isLoading: boolean;
  error: string | null;
  source: 'static' | 'wordpress';
  refresh: () => Promise<void>;
}

const MenuDataContext = createContext<MenuDataContextValue | null>(null);

interface MenuDataProviderProps {
  children: ReactNode;
}

export function MenuDataProvider({ children }: MenuDataProviderProps) {
  const menuDataState = useMenuData();

  return (
    <MenuDataContext.Provider value={menuDataState}>
      {children}
    </MenuDataContext.Provider>
  );
}

export function useMenuDataContext(): MenuDataContextValue {
  const context = useContext(MenuDataContext);
  if (!context) {
    throw new Error('useMenuDataContext must be used within a MenuDataProvider');
  }
  return context;
}
