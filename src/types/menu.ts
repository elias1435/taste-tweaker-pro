export type DietaryBadge = 'V' | 'VG' | 'GF' | 'S';

export interface MenuOption {
  id: string;
  label: string;
  priceDelta: number;
  maxQuantity?: number; // Max quantity per option (default: 1 for single, 5 for multiple)
}

export interface OptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: MenuOption[];
  allowQuantity?: boolean; // Allow quantity selection per option (for multiple type)
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  categoryId: string;
  dietaryBadges?: DietaryBadge[];
  optionGroups: OptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface OptionSelection {
  optionId: string;
  quantity: number;
}

export interface CartItemSelection {
  groupId: string;
  options: OptionSelection[];
}

export interface CartItem {
  id: string;
  menuItemId: string;
  quantity: number;
  selections: CartItemSelection[];
  notes?: string;
  totalPrice: number;
}

export interface MenuData {
  categories: Category[];
  items: MenuItem[];
}
