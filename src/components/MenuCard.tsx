import type { MenuItem } from '@/types/menu';
import { DietaryBadgeComponent } from './DietaryBadge';

interface MenuCardProps {
  item: MenuItem;
  onClick: () => void;
}

export function MenuCard({ item, onClick }: MenuCardProps) {
  return (
    <article 
      className="menu-card shadow-card group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-semibold text-primary whitespace-nowrap">
            ${item.basePrice.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        
        {item.dietaryBadges && item.dietaryBadges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.dietaryBadges.map((badge) => (
              <DietaryBadgeComponent key={badge} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
