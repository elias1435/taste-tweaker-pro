import { useState, useEffect, useCallback, useRef } from 'react';
import heroRamen from '@/assets/hero-ramen.jpg';
import { menuData } from '@/data/menuData';
import { useCartContext } from '@/contexts/CartContext';
import { CategoryNav } from '@/components/CategoryNav';
import { MenuCard } from '@/components/MenuCard';
import { ItemModal } from '@/components/ItemModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CartButton } from '@/components/CartButton';
import { CheckoutSuccess } from '@/components/CheckoutSuccess';
import type { MenuItem, CartItem } from '@/types/menu';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | undefined>();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { items, addItem, updateItem, removeItem, clearCart, itemCount, subtotal } = useCartContext();

  // Set up intersection observer for category tracking
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0 
      }
    );

    categoryRefs.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleCategoryClick = useCallback((categoryId: string) => {
    const element = categoryRefs.current.get(categoryId);
    if (element) {
      const offset = 80; // Height of sticky nav
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleItemClick = useCallback((item: MenuItem) => {
    setEditingCartItem(undefined);
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
    setEditingCartItem(undefined);
  }, []);

  const handleEditCartItem = useCallback((cartItem: CartItem) => {
    const menuItem = menuData.items.find((item) => item.id === cartItem.menuItemId);
    if (menuItem) {
      setEditingCartItem(cartItem);
      setSelectedItem(menuItem);
      setIsCartOpen(false);
    }
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number, newTotal: number) => {
    updateItem(id, { quantity, totalPrice: newTotal });
  }, [updateItem]);

  const handleCheckout = useCallback(() => {
    setLastOrderTotal(subtotal);
    clearCart();
    setIsCartOpen(false);
    setShowCheckoutSuccess(true);
  }, [subtotal, clearCart]);

  const itemsByCategory = menuData.categories.map((category) => ({
    category,
    items: menuData.items.filter((item) => item.categoryId === category.id),
  }));

  return (
    <>
      {/* SEO Meta Tags - handled by index.html */}
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <header className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
          <img
            src={heroRamen}
            alt="Artisan ramen bowl with rich broth and traditional toppings"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-primary text-sm sm:text-base font-medium tracking-[0.3em] uppercase mb-2 animate-fade-in">
              Artisan Crafted
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 animate-fade-in-up">
              Ramen Bar
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Authentic Japanese flavors, crafted with passion in every bowl
            </p>
          </div>
        </header>

        {/* Menu Section */}
        <main className="container max-w-5xl mx-auto px-4 pb-24">
          {/* Category Navigation */}
          <CategoryNav
            categories={menuData.categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />

          {/* Menu Items by Category */}
          <div className="space-y-12 mt-8">
            {itemsByCategory.map(({ category, items }) => (
              <section
                key={category.id}
                id={category.id}
                ref={(el) => {
                  if (el) categoryRefs.current.set(category.id, el);
                }}
                className="scroll-mt-24"
              >
                <div className="mb-6">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-muted-foreground mt-1">{category.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <MenuCard item={item} onClick={() => handleItemClick(item)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* Fixed Cart Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <CartButton itemCount={itemCount} onClick={() => setIsCartOpen(true)} />
        </div>

        {/* Item Modal */}
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={handleCloseModal}
            onAddToCart={addItem}
            editingItem={editingCartItem}
            onUpdateCart={updateItem}
          />
        )}

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={items}
          menuItems={menuData.items}
          subtotal={subtotal}
          onRemoveItem={removeItem}
          onEditItem={handleEditCartItem}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />

        {/* Checkout Success */}
        <CheckoutSuccess
          isOpen={showCheckoutSuccess}
          onClose={() => setShowCheckoutSuccess(false)}
          orderTotal={lastOrderTotal}
        />
      </div>
    </>
  );
};

export default Index;
