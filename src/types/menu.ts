export type DietaryBadge = 'V' | 'VG' | 'GF' | 'S';

export interface MenuOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: MenuOption[];
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

export interface CartItemSelection {
  groupId: string;
  optionIds: string[];
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
