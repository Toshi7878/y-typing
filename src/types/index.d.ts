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
  background: {
    body: { value: `#${string}` };
    card: { value: `#${string}` };
    header: { value: `#${string}` };
  };
  text: {
    body: { value: `#${string}` };
    header: {
      normal: { value: `#${string}` };
      hover: { value: `#${string}` };
    };
  };
  button: {
    sub: {
      hover: { value: `#${string}` };
    };
  };
  border: {
    card: { value: `#${string}` };
    badge: { value: `#${string}` };
  };
  primary: {
    main: { value: `#${string}` };
    light: { value: `#${string}` };
    dark: { value: `#${string}` };
  };
  secondary: {
    main: { value: `#${string}` };
    light: { value: `#${string}` };
  };
  error: {
    main: { value: `#${string}` };
    light: { value: `#${string}` };
  };

  semantic: {
    perfect: { value: `#${string}` };
    roma: { value: `#${string}` };
    kana: { value: `#${string}` };
    flick: { value: `#${string}` };
    like: { value: `#${string}` };
    clap: { value: `#${string}` };
    word: {
      correct: { value: string };
      next: { value: string };
      word: { value: string };
      completed: { value: string };
    };
  };

  home: {
    card: {
      hover: { value: string };
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
