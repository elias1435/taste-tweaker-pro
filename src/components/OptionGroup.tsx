import { Check } from 'lucide-react';
import type { OptionGroup as OptionGroupType, MenuOption } from '@/types/menu';

interface OptionGroupProps {
  group: OptionGroupType;
  selectedOptions: string[];
  onSelectionChange: (optionIds: string[]) => void;
  error?: string;
}

export function OptionGroup({ 
  group, 
  selectedOptions, 
  onSelectionChange,
  error 
}: OptionGroupProps) {
  const handleOptionClick = (option: MenuOption) => {
    if (group.type === 'single') {
      onSelectionChange([option.id]);
    } else {
      // Multiple selection
      const isSelected = selectedOptions.includes(option.id);
      
      if (isSelected) {
        onSelectionChange(selectedOptions.filter((id) => id !== option.id));
      } else {
        // Check if we're at max
        if (selectedOptions.length < group.maxSelect) {
          onSelectionChange([...selectedOptions, option.id]);
        }
      }
    }
  };

  const isOptionDisabled = (optionId: string) => {
    if (group.type === 'single') return false;
    
    // Disable if at max and this option is not selected
    return (
      selectedOptions.length >= group.maxSelect && 
      !selectedOptions.includes(optionId)
    );
  };

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
            {selectedOptions.length > 0 && ` (${selectedOptions.length} selected)`}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {group.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
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
