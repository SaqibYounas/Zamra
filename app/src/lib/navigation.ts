/**
 * Single source of truth for the app's navigation. The sidebar, the mobile
 * drawer and the top-bar breadcrumb all read from this list, so adding a page
 * means editing exactly one array.
 *
 * NOTE: protected routes are enforced separately by the matcher in `proxy.ts`.
 * A new entry here that should require a login must also be added there.
 */

export type NavItem = {
  href: string;
  label: string;
  /** Short label for tight spaces (breadcrumb, collapsed rail tooltip). */
  short?: string;
  description: string;
  icon: NavIconName;
};

export type NavIconName =
  | 'dashboard'
  | 'cost'
  | 'tag'
  | 'production'
  | 'records'
  | 'invoice'
  | 'invoices'
  | 'company'
  | 'password';

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        description: 'Stock, cost and profit at a glance',
        icon: 'dashboard',
      },
      {
        href: '/monthly-records',
        label: 'Monthly Records',
        short: 'Records',
        description: 'Day-by-day stock and profit ledger',
        icon: 'records',
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        href: '/production',
        label: 'Production',
        description: "Log today's bottling output",
        icon: 'production',
      },
      {
        href: '/price',
        label: 'Cost Price',
        description: 'Per-bottle production cost inputs',
        icon: 'cost',
      },
      {
        href: '/selling-price',
        label: 'Selling Price',
        description: 'Customer-facing rate per bottle',
        icon: 'tag',
      },
    ],
  },
  {
    title: 'Billing',
    items: [
      {
        href: '/bill-generate',
        label: 'New Invoice',
        description: 'Build and download a customer invoice',
        icon: 'invoice',
      },
      {
        href: '/invoices',
        label: 'Invoice History',
        short: 'Invoices',
        description: 'Saved invoices, with preview and editing',
        icon: 'invoice',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        href: '/company-info',
        label: 'Company Info',
        description: 'Business details used on invoices',
        icon: 'company',
      },
      {
        href: '/change-password',
        label: 'Change Password',
        short: 'Password',
        description: 'Update your admin credentials',
        icon: 'password',
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap(
  (section) => section.items
);

export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.href === pathname);
}
