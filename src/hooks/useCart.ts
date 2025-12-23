import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/menu';

const CART_STORAGE_KEY = 'ramen-bar-cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
  };
}
