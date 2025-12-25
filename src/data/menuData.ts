import type { MenuData } from '@/types/menu';

import gyozaImg from '@/assets/gyoza.jpg';
import edamameImg from '@/assets/edamame.jpg';
import karaageImg from '@/assets/karaage.jpg';
import takoyakiImg from '@/assets/takoyaki.jpg';
import tempuraImg from '@/assets/tempura.jpg';
import tonkotsuImg from '@/assets/tonkotsu-ramen.jpg';
import shoyuImg from '@/assets/shoyu-ramen.jpg';
import misoImg from '@/assets/miso-ramen.jpg';
import tantanmenImg from '@/assets/tantanmen.jpg';
import matchaImg from '@/assets/matcha.jpg';
import beerImg from '@/assets/beer.jpg';
import sakeImg from '@/assets/sake.jpg';
import mochiImg from '@/assets/mochi.jpg';
import dorayakiImg from '@/assets/dorayaki.jpg';
import sesameIceCreamImg from '@/assets/sesame-ice-cream.jpg';

// Common option groups reused across items
const sizeOptions = {
  id: 'size',
  name: 'Choose Your Size',
  type: 'single' as const,
  required: true,
  minSelect: 1,
  maxSelect: 1,
  options: [
    { id: 'small', label: 'Small', priceDelta: 0 },
    { id: 'regular', label: 'Regular', priceDelta: 2 },
    { id: 'large', label: 'Large', priceDelta: 4 },
  ],
};

const ramenToppings = {
  id: 'toppings',
  name: 'Add Extra Toppings',
  type: 'multiple' as const,
  required: false,
  minSelect: 0,
  maxSelect: 6,
  allowQuantity: true,
  options: [
    { id: 'extra-egg', label: 'Extra Soft-Boiled Egg', priceDelta: 2, maxQuantity: 3 },
    { id: 'extra-chashu', label: 'Extra Chashu Pork', priceDelta: 3, maxQuantity: 3 },
    { id: 'corn', label: 'Sweet Corn', priceDelta: 1, maxQuantity: 2 },
    { id: 'nori', label: 'Extra Nori (3pcs)', priceDelta: 1, maxQuantity: 3 },
    { id: 'bamboo', label: 'Menma Bamboo Shoots', priceDelta: 1.5, maxQuantity: 2 },
    { id: 'butter', label: 'Hokkaido Butter', priceDelta: 1, maxQuantity: 2 },
  ],
};

const spiceLevel = {
  id: 'spice',
  name: 'Spice Level',
  type: 'single' as const,
  required: true,
  minSelect: 1,
  maxSelect: 1,
  options: [
    { id: 'mild', label: 'Mild', priceDelta: 0 },
    { id: 'medium', label: 'Medium', priceDelta: 0 },
    { id: 'hot', label: 'Hot', priceDelta: 0 },
    { id: 'extra-hot', label: 'Extra Hot 🔥', priceDelta: 0 },
  ],
};

const noodleTexture = {
  id: 'noodle-texture',
  name: 'Noodle Texture',
  type: 'single' as const,
  required: false,
  minSelect: 0,
  maxSelect: 1,
  options: [
    { id: 'soft', label: 'Soft (Yawa)', priceDelta: 0 },
    { id: 'regular-noodle', label: 'Regular (Futsu)', priceDelta: 0 },
    { id: 'firm', label: 'Firm (Kata)', priceDelta: 0 },
    { id: 'extra-firm', label: 'Extra Firm (Barikata)', priceDelta: 0 },
  ],
};

const dippingSauce = {
  id: 'sauce',
  name: 'Dipping Sauce',
  type: 'single' as const,
  required: false,
  minSelect: 0,
  maxSelect: 1,
  options: [
    { id: 'ponzu', label: 'Citrus Ponzu', priceDelta: 0 },
    { id: 'gyoza-sauce', label: 'House Gyoza Sauce', priceDelta: 0 },
    { id: 'spicy-mayo', label: 'Spicy Mayo', priceDelta: 0.5 },
  ],
};

export const menuData: MenuData = {
  categories: [
    { id: 'starters', name: 'Starters', description: 'Begin your journey' },
    { id: 'ramen', name: 'Ramen', description: 'Our signature bowls' },
    { id: 'drinks', name: 'Drinks', description: 'Refresh & unwind' },
    { id: 'desserts', name: 'Desserts', description: 'Sweet endings' },
  ],
  items: [
    // Starters
    {
      id: 'gyoza',
      name: 'Pork Gyoza',
      description: 'Pan-fried dumplings with juicy pork and vegetable filling, served with house ponzu',
      image: gyozaImg,
      basePrice: 8,
      categoryId: 'starters',
      optionGroups: [
        {
          id: 'gyoza-quantity',
          name: 'Quantity',
          type: 'single',
          required: true,
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: '5pc', label: '5 Pieces', priceDelta: 0 },
            { id: '8pc', label: '8 Pieces', priceDelta: 4 },
            { id: '12pc', label: '12 Pieces', priceDelta: 8 },
          ],
        },
        dippingSauce,
      ],
    },
    {
      id: 'edamame',
      name: 'Edamame',
      description: 'Steamed young soybeans with Okinawan sea salt',
      image: edamameImg,
      basePrice: 5,
      categoryId: 'starters',
      dietaryBadges: ['V', 'VG', 'GF'],
      optionGroups: [
        {
          id: 'edamame-style',
          name: 'Style',
          type: 'single',
          required: false,
          minSelect: 0,
          maxSelect: 1,
          options: [
            { id: 'plain', label: 'Classic Sea Salt', priceDelta: 0 },
            { id: 'garlic', label: 'Garlic Butter', priceDelta: 1 },
            { id: 'spicy', label: 'Spicy Chili Garlic', priceDelta: 1 },
          ],
        },
      ],
    },
    {
      id: 'karaage',
      name: 'Chicken Karaage',
      description: 'Crispy Japanese fried chicken thighs with kewpie mayo and lemon',
      image: karaageImg,
      basePrice: 10,
      categoryId: 'starters',
      optionGroups: [
        {
          id: 'karaage-size',
          name: 'Portion Size',
          type: 'single',
          required: true,
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'small-portion', label: 'Small (4 pcs)', priceDelta: 0 },
            { id: 'regular-portion', label: 'Regular (6 pcs)', priceDelta: 3 },
            { id: 'large-portion', label: 'Large (8 pcs)', priceDelta: 6 },
          ],
        },
      ],
    },
    {
      id: 'takoyaki',
      name: 'Takoyaki',
      description: 'Crispy octopus balls with bonito flakes, takoyaki sauce, and kewpie mayo',
      image: takoyakiImg,
      basePrice: 9,
      categoryId: 'starters',
      optionGroups: [],
    },
    {
      id: 'tempura',
      name: 'Vegetable Tempura',
      description: 'Seasonal vegetables in light, crispy batter with tentsuyu dipping sauce',
      image: tempuraImg,
      basePrice: 11,
      categoryId: 'starters',
      dietaryBadges: ['V'],
      optionGroups: [],
    },
    // Ramen
    {
      id: 'tonkotsu',
      name: 'Hakata Tonkotsu',
      description: 'Rich, creamy 18-hour pork bone broth with chashu, soft egg, nori, and scallions',
      image: tonkotsuImg,
      basePrice: 16,
      categoryId: 'ramen',
      optionGroups: [sizeOptions, ramenToppings, noodleTexture],
    },
    {
      id: 'shoyu',
      name: 'Tokyo Shoyu',
      description: 'Clear soy-based broth with chicken and dashi, topped with chashu and menma',
      image: shoyuImg,
      basePrice: 15,
      categoryId: 'ramen',
      optionGroups: [sizeOptions, ramenToppings, noodleTexture],
    },
    {
      id: 'miso',
      name: 'Sapporo Miso',
      description: 'Hearty miso broth with ground pork, corn, butter, and bean sprouts',
      image: misoImg,
      basePrice: 16,
      categoryId: 'ramen',
      optionGroups: [sizeOptions, ramenToppings, noodleTexture],
    },
    {
      id: 'tantanmen',
      name: 'Spicy Tantanmen',
      description: 'Sesame chili broth with ground pork, bok choy, and a perfect soft egg',
      image: tantanmenImg,
      basePrice: 17,
      categoryId: 'ramen',
      dietaryBadges: ['S'],
      optionGroups: [sizeOptions, spiceLevel, ramenToppings, noodleTexture],
    },
    {
      id: 'veggie-ramen',
      name: 'Garden Miso',
      description: 'Vegetable miso broth with tofu, seasonal vegetables, and mushrooms',
      image: misoImg,
      basePrice: 14,
      categoryId: 'ramen',
      dietaryBadges: ['V', 'VG'],
      optionGroups: [
        sizeOptions,
        {
          id: 'veggie-protein',
          name: 'Add Protein',
          type: 'multiple',
          required: false,
          minSelect: 0,
          maxSelect: 2,
          options: [
            { id: 'extra-tofu', label: 'Extra Firm Tofu', priceDelta: 2 },
            { id: 'tempeh', label: 'Marinated Tempeh', priceDelta: 2.5 },
          ],
        },
        noodleTexture,
      ],
    },
    // Drinks
    {
      id: 'matcha',
      name: 'Ceremonial Matcha',
      description: 'Stone-ground Uji matcha, whisked to perfection',
      image: matchaImg,
      basePrice: 5,
      categoryId: 'drinks',
      dietaryBadges: ['V', 'VG', 'GF'],
      optionGroups: [
        {
          id: 'matcha-style',
          name: 'Style',
          type: 'single',
          required: true,
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'hot', label: 'Hot', priceDelta: 0 },
            { id: 'iced', label: 'Iced', priceDelta: 0 },
            { id: 'latte', label: 'Latte', priceDelta: 1 },
          ],
        },
      ],
    },
    {
      id: 'beer',
      name: 'Asahi Super Dry',
      description: 'Crisp Japanese lager, perfectly poured',
      image: beerImg,
      basePrice: 7,
      categoryId: 'drinks',
      dietaryBadges: ['V', 'VG'],
      optionGroups: [
        {
          id: 'beer-size',
          name: 'Size',
          type: 'single',
          required: true,
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'small-beer', label: 'Small (330ml)', priceDelta: 0 },
            { id: 'large-beer', label: 'Large (500ml)', priceDelta: 3 },
          ],
        },
      ],
    },
    {
      id: 'sake',
      name: 'House Sake',
      description: 'Smooth junmai sake, served warm or cold',
      image: sakeImg,
      basePrice: 9,
      categoryId: 'drinks',
      dietaryBadges: ['V', 'VG', 'GF'],
      optionGroups: [
        {
          id: 'sake-temp',
          name: 'Temperature',
          type: 'single',
          required: true,
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'cold', label: 'Cold (Reishu)', priceDelta: 0 },
            { id: 'warm', label: 'Warm (Nurukan)', priceDelta: 0 },
            { id: 'hot', label: 'Hot (Atsukan)', priceDelta: 0 },
          ],
        },
        {
          id: 'sake-size',
          name: 'Size',
          type: 'single',
          required: true,
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'glass', label: 'Glass (180ml)', priceDelta: 0 },
            { id: 'carafe', label: 'Carafe (300ml)', priceDelta: 6 },
          ],
        },
      ],
    },
    {
      id: 'ramune',
      name: 'Ramune Soda',
      description: 'Classic Japanese marble soda in original flavor',
      image: matchaImg,
      basePrice: 4,
      categoryId: 'drinks',
      dietaryBadges: ['V', 'VG'],
      optionGroups: [],
    },
    // Desserts
    {
      id: 'mochi',
      name: 'Mochi Ice Cream',
      description: 'Chewy rice cake filled with creamy ice cream',
      image: mochiImg,
      basePrice: 6,
      categoryId: 'desserts',
      dietaryBadges: ['V', 'GF'],
      optionGroups: [
        {
          id: 'mochi-flavor',
          name: 'Choose Flavors (pick 3)',
          type: 'multiple',
          required: true,
          minSelect: 3,
          maxSelect: 3,
          allowQuantity: false,
          options: [
            { id: 'matcha-mochi', label: 'Matcha', priceDelta: 0 },
            { id: 'strawberry', label: 'Strawberry', priceDelta: 0 },
            { id: 'mango', label: 'Mango', priceDelta: 0 },
            { id: 'vanilla', label: 'Vanilla', priceDelta: 0 },
            { id: 'black-sesame-mochi', label: 'Black Sesame', priceDelta: 0 },
          ],
        },
      ],
    },
    {
      id: 'dorayaki',
      name: 'Dorayaki',
      description: 'Fluffy honey pancakes filled with sweet red bean paste',
      image: dorayakiImg,
      basePrice: 5,
      categoryId: 'desserts',
      dietaryBadges: ['V'],
      optionGroups: [
        {
          id: 'dorayaki-topping',
          name: 'Add Topping',
          type: 'single',
          required: false,
          minSelect: 0,
          maxSelect: 1,
          options: [
            { id: 'vanilla-ice', label: 'Vanilla Ice Cream', priceDelta: 2 },
            { id: 'matcha-ice', label: 'Matcha Ice Cream', priceDelta: 2 },
            { id: 'cream', label: 'Fresh Cream', priceDelta: 1 },
          ],
        },
      ],
    },
    {
      id: 'sesame-ice-cream',
      name: 'Black Sesame Ice Cream',
      description: 'Rich, nutty black sesame ice cream with matcha cookie',
      image: sesameIceCreamImg,
      basePrice: 7,
      categoryId: 'desserts',
      dietaryBadges: ['V', 'GF'],
      optionGroups: [],
    },
    {
      id: 'matcha-cheesecake',
      name: 'Matcha Cheesecake',
      description: 'Light, fluffy Japanese-style cheesecake with matcha swirl',
      image: mochiImg,
      basePrice: 8,
      categoryId: 'desserts',
      dietaryBadges: ['V'],
      optionGroups: [],
    },
  ],
};
