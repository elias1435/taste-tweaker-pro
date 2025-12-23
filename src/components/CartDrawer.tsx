import { X, ShoppingBag, Minus, Plus, Pencil, Trash2 } from 'lucide-react';
import type { CartItem, MenuItem } from '@/types/menu';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  menuItems: MenuItem[];
  subtotal: number;
  onRemoveItem: (id: string) => void;
  onEditItem: (item: CartItem) => void;
  onUpdateQuantity: (id: string, quantity: number, newTotal: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  menuItems,
  subtotal,
  onRemoveItem,
  onEditItem,
  onUpdateQuantity,
  onCheckout
}: CartDrawerProps) {
  const getMenuItem = (menuItemId: string) => {
    return menuItems.find((item) => item.id === menuItemId);
  };

  const getOptionSummary = (cartItem: CartItem) => {
    const menuItem = getMenuItem(cartItem.menuItemId);
    if (!menuItem) return '';
    
    const summaries: string[] = [];
    
    cartItem.selections.forEach((selection) => {
      const group = menuItem.optionGroups.find((g) => g.id === selection.groupId);
      if (group) {
        const optionLabels = selection.optionIds
          .map((optId) => group.options.find((o) => o.id === optId)?.label)
          .filter(Boolean);
        if (optionLabels.length > 0) {
          summaries.push(optionLabels.join(', '));
        }
      }
    });
    
    return summaries.join(' • ');
  };

  const calculateUnitPrice = (cartItem: CartItem) => {
    return cartItem.totalPrice / cartItem.quantity;
  };

  const handleQuantityChange = (cartItem: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    const unitPrice = calculateUnitPrice(cartItem);
    const newTotal = unitPrice * newQuantity;
    onUpdateQuantity(cartItem.id, newQuantity, newTotal);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-card shadow-elevated animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-semibold">Your Order</h2>
            {items.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add some delicious items to get started</p>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-4">
              {items.map((cartItem) => {
                const menuItem = getMenuItem(cartItem.menuItemId);
                if (!menuItem) return null;
                
                return (
                  <div 
                    key={cartItem.id}
                    className="bg-secondary/50 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={menuItem.image}
                        alt={menuItem.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {menuItem.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {getOptionSummary(cartItem)}
                        </p>
                        {cartItem.notes && (
                          <p className="text-xs text-muted-foreground/70 mt-1 italic">
                            "{cartItem.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(cartItem, cartItem.quantity - 1)}
                          disabled={cartItem.quantity <= 1}
                          className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center disabled:opacity-40 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium tabular-nums">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(cartItem, cartItem.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditItem(cartItem)}
                          className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                          aria-label="Edit item"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(cartItem.id)}
                          className="w-8 h-8 rounded-lg hover:bg-destructive/20 flex items-center justify-center transition-colors text-muted-foreground hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <span className="font-semibold text-primary ml-2">
                          ${cartItem.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-border bg-card space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            
            <Button
              onClick={onCheckout}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
