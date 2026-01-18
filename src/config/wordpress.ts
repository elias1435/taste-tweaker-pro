// WordPress API Configuration
// Set your WordPress site URL here (e.g., 'https://your-site.com')
// Leave empty to use static data only

export const WORDPRESS_CONFIG = {
  // Base URL of your WordPress site (without trailing slash)
  baseUrl: '',
  
  // Custom endpoint for menu data (requires WP plugin or custom REST route)
  // Default: /wp-json/ramen-menu/v1/menu
  menuEndpoint: '/wp-json/ramen-menu/v1/menu',
  
  // Enable/disable WordPress integration
  enabled: false,
  
  // Cache duration in milliseconds (5 minutes default)
  cacheDuration: 5 * 60 * 1000,
};

// Enable WordPress by setting your site URL
export function configureWordPress(baseUrl: string) {
  WORDPRESS_CONFIG.baseUrl = baseUrl.replace(/\/$/, '');
  WORDPRESS_CONFIG.enabled = true;
}
