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

export type LeftNavConfig = {
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

export interface Line {
  time: string;
  lyrics: string;
  word: string;
  lineNumber?: string;
  options?: { eternalCSS?: string; changeCSS?: string };
}

// react-tag-input Tag 型は時前で定義しなければならない
export interface Tag {
  id: string;
  className: string;
  [key: string]: string;
}

interface ThemeColors {
  colors: {
    background: string;
    color: string;
    menu: {
      bg: string;
      color: string;
    };
    header: {
      bg: string;
    };
    home: {
      card: {
        bg: string;
        link: string;
        hover: string;
      };
    };
    type: {
      card: {
        bg: string;
        color: string;
        borderColor: string;
        hover: {
          bg: string;
        };
      };
      word: {
        correct: string;
        next: string;
        word: string;
        completed: string;
      };
      tab: {
        ranking: {
          myrank: {
            color: string;
          };
        };
      };
      tooltip?: {
        bg: string;
        color: string;
      };
      ready: {
        radio: {
          hover: {
            bg: string;
            color: string;
          };
          selected: {
            bg: string;
            color: string;
          };
        };
      };
      progress: {
        bg: string;
      };
    };
  };
}
