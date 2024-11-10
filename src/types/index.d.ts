import { EditorNewMapBackUpInfoData, EditorSendData } from "@/app/edit/ts/type";

export type HeaderMenu = { title: string; href: string };

export type NavItem = {
  title: string;
  menuItem: HeaderMenu[];
  disabled?: boolean;
};

export type LeftNavConfig = {
  items: NavItem[];
};

export interface LineInput {
  time?: string;
  lyrics?: string;
  word: string;
  selectCount?: number;
}

export interface LineEdit {
  time: string;
  lyrics: string;
  word: string;
  selectedLineCount?: number;
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
      badge: {
        info: {
          bg: string;
          color: string;
          borderColor: string;
        };
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

    edit: {
      mapTable: {
        currentTimeLine: {
          bg: `#${string}`;
        };
        selectedLine: {
          bg: `#${string}`;
          outlineColor: `#${string}`;
        };
        errorLine: {
          bg: `#${string}`;
        };
      };
    };
  };
}

export type YouTubeSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export interface IndexDBOption {
  id: number;
  optionName: string;
  value: string | number | boolean | EditorNewMapBackUpInfoData | MapData[];
}

export interface UploadResult {
  id: number | string | null;
  title: string;
  message: string;
  status: number;
  errorObject?: unknown;
}
