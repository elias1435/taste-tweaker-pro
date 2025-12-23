import { ShoppingBag } from 'lucide-react';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export function CartButton({ itemCount, onClick }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-3 rounded-full bg-primary text-primary-foreground shadow-glow hover:shadow-lg transition-all duration-300 animate-pulse-glow"
      aria-label={`Open cart with ${itemCount} items`}
    >
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
