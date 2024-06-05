export interface InputFormSchema {
  EditorTab: {
    time: string;
    lyrics: string;
    word: string;
    lineNumber?: string;
    addLyrics?: string;
  };
  InfoTab: {
    url: string;
    title: string;
  };
  UploadTab: {
    creatorComment: string;
  };
  TimeRange: {
    range: string;
  };
}
