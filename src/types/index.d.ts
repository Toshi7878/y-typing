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
    card: {
      bg: string;
      color: string;
      borderColor: `#${string}`;
      hover: {
        bg: string;
      };
    };
    type: {
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
        hover: {
          bg: string;
        };
      };
    };
  };
}

export type YouTubeSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
