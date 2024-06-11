import React, { createContext, useContext, useRef } from "react";
import { Line } from "../(tab-content)/(ts)/buttonEvent";

export interface EditorTab {
  add: () => void;
  update: () => void;
  delete: () => void;
  undoAdd: (undoLine: Line) => void;
}

export interface RefsContextType {
  editorTabRef: React.RefObject<EditorTab>;
  infoUploadTabRef: React.RefObject<EditorTab>;
  lineRowRef: React.RefObject<HTMLElement>;
  playerRef: any;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  editorTabRef: { current: null },
  infoUploadTabRef: { current: null },
  lineRowRef: { current: null },
  playerRef: null,
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const editorTabRef = useRef(null);
  const infoUploadTabRef = useRef(null);
  const lineRowRef = useRef(null);
  const playerRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "editorTab":
        editorTabRef.current = ref;
        break;
      case "infoUploadTab":
        infoUploadTabRef.current = ref;
        break;
      case "lineRow":
        lineRowRef.current = ref;
        break;
      case "playerRef":
        playerRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider value={{ editorTabRef, infoUploadTabRef, lineRowRef, playerRef, setRef }}>
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    editorTabRef: context.editorTabRef,
    infoUploadTabRef: context.infoUploadTabRef,
    lineRowRef: context.lineRowRef,
    playerRef: context.playerRef,
    setRef: context.setRef,
  };
};
