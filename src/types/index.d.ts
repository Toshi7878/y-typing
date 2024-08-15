export type HeaderMenu = { title: string; href: string };

export type NavItem = {
  title: string;
  menuItem: HeaderMenu[];
  disabled?: boolean;
};

export type LeftNavConfig = {
  items: NavItem[];
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
    background: `#${string}`;
    color: `#${string}`;

    popup: {
      bg: string;
      color: string;
      hover: {
        bg: string;
      };
    };
    header: {
      bg: string;
      color: string;
      hover: {
        color: string;
        bg: string;
      };
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
        error: string;
      };
      tab: {
        ranking: {
          myrank: {
            color: string;
          };
          perfect: {
            color: string;
          };
        };
      };

      ready: {
        radio: {
          roma: {
            bg: `#${string}`;
          };
          kana: {
            bg: `#${string}`;
          };
          flick: {
            bg: `#${string}`;
          };
          hover: {
            color: string;
          };
          selected: {
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
