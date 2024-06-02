export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    x: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MarketingConfig = {
  mainNav: NavItem[];
};

export type SidebarNavItem =
  | ({
      title: string;
      disaboked?: boolean;
      external?: boolean;
      icon?: keyof typeof Icon;
    } & {
      href: string;
      items?: NavItem[];
    })
  | {
      title: string;
      href?: string;
      items: NavItem[];
      icon?: keyof typeof Icon;
    };

export type DashboardConfig = {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};
