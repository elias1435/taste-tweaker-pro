import type { DietaryBadge } from '@/types/menu';

interface DietaryBadgeProps {
  badge: DietaryBadge;
}

const badgeConfig: Record<DietaryBadge, { label: string; className: string }> = {
  V: {
    label: 'V',
    className: 'bg-badge-vegetarian/20 text-badge-vegetarian',
  },
  VG: {
    label: 'VG',
    className: 'bg-badge-vegan/20 text-badge-vegan',
  },
  GF: {
    label: 'GF',
    className: 'bg-badge-gluten-free/20 text-badge-gluten-free',
  },
  S: {
    label: '🌶',
    className: 'bg-badge-spicy/20 text-badge-spicy',
  },
};

export function DietaryBadgeComponent({ badge }: DietaryBadgeProps) {
  const config = badgeConfig[badge];
  
  return (
    <span className={`dietary-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
