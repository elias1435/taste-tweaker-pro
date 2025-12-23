import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
}

export function CheckoutSuccess({ isOpen, onClose, orderTotal }: CheckoutSuccessProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-2xl shadow-elevated p-8 max-w-sm w-full text-center animate-scale-in">
        <div className="w-20 h-20 bg-badge-vegan/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-badge-vegan" />
        </div>
        
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Order Confirmed!
        </h2>
        
        <p className="text-muted-foreground mb-4">
          Thank you for your order. Your delicious ramen is being prepared.
        </p>
        
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground">Order Total</p>
          <p className="text-2xl font-bold text-primary">${orderTotal.toFixed(2)}</p>
        </div>
        
        <Button onClick={onClose} className="w-full" size="lg">
          Continue Browsing
        </Button>
      </div>
    </div>
  );
}
