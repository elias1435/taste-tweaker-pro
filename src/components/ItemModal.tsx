import { useState, useEffect, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import type { MenuItem, CartItem, CartItemSelection } from '@/types/menu';
import { DietaryBadgeComponent } from './DietaryBadge';
import { QuantityStepper } from './QuantityStepper';
import { OptionGroup } from './OptionGroup';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  editingItem?: CartItem;
  onUpdateCart?: (id: string, updates: Partial<CartItem>) => void;
}

export function ItemModal({ 
  item, 
  isOpen, 
  onClose, 
  onAddToCart,
  editingItem,
  onUpdateCart
}: ItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Map<string, string[]>>(new Map());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  // Initialize state when editing or opening fresh
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setQuantity(editingItem.quantity);
        const selMap = new Map<string, string[]>();
        editingItem.selections.forEach((sel) => {
          selMap.set(sel.groupId, sel.optionIds);
        });
        setSelections(selMap);
        setNotes(editingItem.notes || '');
      } else {
        setQuantity(1);
        setSelections(new Map());
        setNotes('');
      }
      setErrors(new Map());
    }
  }, [isOpen, editingItem]);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSelectionChange = useCallback((groupId: string, optionIds: string[]) => {
    setSelections((prev) => {
      const next = new Map(prev);
      next.set(groupId, optionIds);
      return next;
    });
    
    // Clear error for this group
    setErrors((prev) => {
      const next = new Map(prev);
      next.delete(groupId);
      return next;
    });
  }, []);

  // Calculate total price
  const totalPrice = useMemo(() => {
    let total = item.basePrice;
    
    item.optionGroups.forEach((group) => {
      const selectedIds = selections.get(group.id) || [];
      selectedIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (option) {
          total += option.priceDelta;
        }
      });
    });
    
    return total * quantity;
  }, [item, selections, quantity]);

  // Validation
  const validate = useCallback(() => {
    const newErrors = new Map<string, string>();
    
    item.optionGroups.forEach((group) => {
      const selectedIds = selections.get(group.id) || [];
      
      if (group.required && selectedIds.length < group.minSelect) {
        newErrors.set(
          group.id, 
          group.minSelect === 1 
            ? 'Please make a selection' 
            : `Please select at least ${group.minSelect} option${group.minSelect > 1 ? 's' : ''}`
        );
      }
    });
    
    setErrors(newErrors);
    return newErrors.size === 0;
  }, [item.optionGroups, selections]);

  const isValid = useMemo(() => {
    return item.optionGroups.every((group) => {
      if (!group.required) return true;
      const selectedIds = selections.get(group.id) || [];
      return selectedIds.length >= group.minSelect;
    });
  }, [item.optionGroups, selections]);

  const handleSubmit = () => {
    if (!validate()) return;
    
    const cartSelections: CartItemSelection[] = [];
    selections.forEach((optionIds, groupId) => {
      if (optionIds.length > 0) {
        cartSelections.push({ groupId, optionIds });
      }
    });

    if (editingItem && onUpdateCart) {
      onUpdateCart(editingItem.id, {
        quantity,
        selections: cartSelections,
        notes: notes.trim() || undefined,
        totalPrice,
      });
    } else {
      onAddToCart({
        menuItemId: item.id,
        quantity,
        selections: cartSelections,
        notes: notes.trim() || undefined,
        totalPrice,
      });
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-t-2xl sm:rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
        {/* Header Image */}
        <div className="relative h-48 sm:h-56">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Title overlaid on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 id="modal-title" className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              {item.name}
            </h2>
            <p className="text-muted-foreground mt-1">{item.description}</p>
            
            {item.dietaryBadges && item.dietaryBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.dietaryBadges.map((badge) => (
                  <DietaryBadgeComponent key={badge} badge={badge} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-12rem-5rem)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Option Groups */}
            {item.optionGroups.map((group) => (
              <OptionGroup
                key={group.id}
                group={group}
                selectedOptions={selections.get(group.id) || []}
                onSelectionChange={(optionIds) => handleSelectionChange(group.id, optionIds)}
                error={errors.get(group.id)}
              />
            ))}
            
            {/* Special Instructions */}
            <div className="space-y-2">
              <label htmlFor="notes" className="font-medium text-foreground">
                Special Instructions
                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
              </label>
              <Textarea
                id="notes"
                placeholder="Any allergies or special requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-border bg-card">
          <div className="flex items-center gap-4">
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
            
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 h-12 text-base font-semibold"
              size="lg"
            >
              {editingItem ? 'Update' : 'Add to Cart'} — ${totalPrice.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
