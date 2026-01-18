import type { MenuData, MenuItem, Category, OptionGroup, DietaryBadge } from '@/types/menu';
import { WORDPRESS_CONFIG } from '@/config/wordpress';

// WordPress REST API response types
interface WPCategory {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

interface WPMenuOption {
  id: string;
  label: string;
  price_delta: number;
  max_quantity?: number;
}

interface WPOptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  min_select: number;
  max_select: number;
  allow_quantity?: boolean;
  options: WPMenuOption[];
}

interface WPMenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  base_price: number;
  category_id: string;
  dietary_badges?: string[];
  option_groups: WPOptionGroup[];
}

interface WPMenuResponse {
  categories: WPCategory[];
  items: WPMenuItem[];
}

// Transform WordPress data to app format
function transformCategory(wpCategory: WPCategory): Category {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    description: wpCategory.description,
  };
}

function transformOptionGroup(wpGroup: WPOptionGroup): OptionGroup {
  return {
    id: wpGroup.id,
    name: wpGroup.name,
    type: wpGroup.type,
    required: wpGroup.required,
    minSelect: wpGroup.min_select,
    maxSelect: wpGroup.max_select,
    allowQuantity: wpGroup.allow_quantity,
    options: wpGroup.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      priceDelta: opt.price_delta,
      maxQuantity: opt.max_quantity,
    })),
  };
}

function transformMenuItem(wpItem: WPMenuItem): MenuItem {
  return {
    id: wpItem.id,
    name: wpItem.name,
    description: wpItem.description,
    image: wpItem.image,
    basePrice: wpItem.base_price,
    categoryId: wpItem.category_id,
    dietaryBadges: wpItem.dietary_badges as DietaryBadge[] | undefined,
    optionGroups: wpItem.option_groups.map(transformOptionGroup),
  };
}

function transformMenuData(wpData: WPMenuResponse): MenuData {
  return {
    categories: wpData.categories.map(transformCategory),
    items: wpData.items.map(transformMenuItem),
  };
}

// Cache management
let cachedData: MenuData | null = null;
let cacheTimestamp: number = 0;

function isCacheValid(): boolean {
  return cachedData !== null && 
    Date.now() - cacheTimestamp < WORDPRESS_CONFIG.cacheDuration;
}

// Fetch menu data from WordPress
export async function fetchWordPressMenu(): Promise<MenuData> {
  if (!WORDPRESS_CONFIG.enabled || !WORDPRESS_CONFIG.baseUrl) {
    throw new Error('WordPress integration is not configured');
  }

  // Check cache first
  if (isCacheValid() && cachedData) {
    return cachedData;
  }

  const url = `${WORDPRESS_CONFIG.baseUrl}${WORDPRESS_CONFIG.menuEndpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  const data: WPMenuResponse = await response.json();
  const transformedData = transformMenuData(data);

  // Update cache
  cachedData = transformedData;
  cacheTimestamp = Date.now();

  return transformedData;
}

// Clear the cache (useful for manual refresh)
export function clearMenuCache(): void {
  cachedData = null;
  cacheTimestamp = 0;
}

// Check if WordPress is configured
export function isWordPressEnabled(): boolean {
  return WORDPRESS_CONFIG.enabled && !!WORDPRESS_CONFIG.baseUrl;
}
