export type NavItem = {
  href: string;
  label: string;
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
  | 'password'
  | 'badge-percent';

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
      {
        href: '/today-prices',
        label: 'Today Prices',
        description: 'Today price per bottle',
        icon: 'badge-percent',
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
        icon: 'invoices',
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
