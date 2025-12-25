import { Check, Minus, Plus } from 'lucide-react';
import type { OptionGroup as OptionGroupType, MenuOption, OptionSelection } from '@/types/menu';

interface OptionGroupProps {
  group: OptionGroupType;
  selectedOptions: OptionSelection[];
  onSelectionChange: (options: OptionSelection[]) => void;
  error?: string;
}

export function OptionGroup({ 
  group, 
  selectedOptions, 
  onSelectionChange,
  error 
}: OptionGroupProps) {
  const getOptionQuantity = (optionId: string) => {
    return selectedOptions.find((o) => o.optionId === optionId)?.quantity || 0;
  };

  const getTotalSelectedCount = () => {
    return selectedOptions.reduce((sum, o) => sum + o.quantity, 0);
  };

  const handleOptionClick = (option: MenuOption) => {
    if (group.type === 'single') {
      onSelectionChange([{ optionId: option.id, quantity: 1 }]);
    } else {
      const currentQty = getOptionQuantity(option.id);
      
      if (currentQty > 0) {
        // Remove option
        onSelectionChange(selectedOptions.filter((o) => o.optionId !== option.id));
      } else {
        // Add option with quantity 1
        const totalCount = getTotalSelectedCount();
        if (totalCount < group.maxSelect) {
          onSelectionChange([...selectedOptions, { optionId: option.id, quantity: 1 }]);
        }
      }
    }
  };

  const handleQuantityChange = (option: MenuOption, newQuantity: number) => {
    const maxPerOption = option.maxQuantity || 5;
    const currentQty = getOptionQuantity(option.id);
    const totalCount = getTotalSelectedCount();
    const otherCount = totalCount - currentQty;
    
    // Calculate the max we can set based on group max
    const maxAllowed = Math.min(maxPerOption, group.maxSelect - otherCount);
    const clampedQty = Math.max(0, Math.min(newQuantity, maxAllowed));
    
    if (clampedQty === 0) {
      onSelectionChange(selectedOptions.filter((o) => o.optionId !== option.id));
    } else {
      const existing = selectedOptions.find((o) => o.optionId === option.id);
      if (existing) {
        onSelectionChange(
          selectedOptions.map((o) => 
            o.optionId === option.id ? { ...o, quantity: clampedQty } : o
          )
        );
      } else {
        onSelectionChange([...selectedOptions, { optionId: option.id, quantity: clampedQty }]);
      }
    }
  };

  const isOptionDisabled = (optionId: string) => {
    if (group.type === 'single') return false;
    
    const currentQty = getOptionQuantity(optionId);
    const totalCount = getTotalSelectedCount();
    
    // Disable if at max and this option has 0 quantity
    return totalCount >= group.maxSelect && currentQty === 0;
  };

  const showQuantityControls = group.type === 'multiple' && group.allowQuantity !== false;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">
          {group.name}
          {group.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </h4>
        {group.type === 'multiple' && (
          <span className="text-xs text-muted-foreground">
            {group.minSelect > 0 && `Min ${group.minSelect}`}
            {group.minSelect > 0 && group.maxSelect > 0 && ' • '}
            {group.maxSelect > 0 && `Max ${group.maxSelect}`}
            {getTotalSelectedCount() > 0 && ` (${getTotalSelectedCount()} selected)`}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {group.options.map((option) => {
          const quantity = getOptionQuantity(option.id);
          const isSelected = quantity > 0;
          const maxPerOption = option.maxQuantity || 5;
          const totalCount = getTotalSelectedCount();
          const maxAllowed = Math.min(maxPerOption, group.maxSelect - totalCount + quantity);
          const canIncrease = quantity < maxAllowed;
          
          // For quantity-enabled multiple select groups, show +/- for each option
          if (showQuantityControls) {
            return (
              <div
                key={option.id}
                className={`option-item ${isSelected ? 'option-item-selected' : ''}`}
              >
                <span className="flex-1 font-medium">{option.label}</span>
                
                {/* Quantity controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(option, quantity - 1)}
                    disabled={quantity <= 0}
                    className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium text-sm tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(option, quantity + 1)}
                    disabled={!canIncrease}
                    className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                {option.priceDelta !== 0 && (
                  <span className={`text-sm font-medium min-w-[60px] text-right ${
                    option.priceDelta > 0 ? 'text-primary' : 'text-badge-vegan'
                  }`}>
                    {option.priceDelta > 0 ? '+' : ''}${option.priceDelta.toFixed(2)}
                    {quantity > 1 && (
                      <span className="text-muted-foreground ml-1">
                        ×{quantity}
                      </span>
                    )}
                  </span>
                )}
              </div>
            );
          }
          
          // Standard checkbox/radio for single select or non-quantity multiple select
          const isDisabled = isOptionDisabled(option.id);
          
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={isDisabled}
              className={`option-item w-full text-left ${
                isSelected ? 'option-item-selected' : ''
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-pressed={isSelected}
            >
              <div className={`w-5 h-5 rounded-${group.type === 'single' ? 'full' : 'md'} border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground/40'
              }`}>
                {isSelected && (
                  <Check className="w-3 h-3 text-primary-foreground" />
                )}
              </div>
              
              <span className="flex-1 font-medium">{option.label}</span>
              
              {option.priceDelta !== 0 && (
                <span className={`text-sm font-medium ${
                  option.priceDelta > 0 ? 'text-primary' : 'text-badge-vegan'
                }`}>
                  {option.priceDelta > 0 ? '+' : ''}${option.priceDelta.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
}
