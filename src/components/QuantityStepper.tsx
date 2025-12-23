import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ 
  quantity, 
  onChange, 
  min = 1, 
  max = 99 
}: QuantityStepperProps) {
  const decrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increment = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= min}
        className="quantity-btn bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span className="w-12 text-center font-semibold text-lg tabular-nums">
        {quantity}
      </span>
      
      <button
        type="button"
        onClick={increment}
        disabled={quantity >= max}
        className="quantity-btn bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
