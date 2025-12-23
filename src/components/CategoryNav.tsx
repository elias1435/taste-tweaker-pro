import { useEffect, useRef, useState } from 'react';
import type { Category } from '@/types/menu';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryNav({ 
  categories, 
  activeCategory, 
  onCategoryClick 
}: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-40 -mx-4 px-4 py-4 transition-all duration-300 ${
        isSticky 
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg' 
          : 'bg-transparent'
      }`}
      aria-label="Menu categories"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`category-chip whitespace-nowrap flex-shrink-0 ${
              activeCategory === category.id
                ? 'category-chip-active'
                : 'category-chip-inactive'
            }`}
            aria-current={activeCategory === category.id ? 'true' : undefined}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
