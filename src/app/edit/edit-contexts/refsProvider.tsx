"use client";
import React, { createContext, useContext, useRef } from "react";
import { EditorButtonsRef, EditorTabRef } from "../ts/type";

export interface RefsContextType {
  editorTabRef: React.RefObject<EditorTabRef>;
  editorButtonsRef: React.RefObject<EditorButtonsRef>;
  editorSettingsRef: React.RefObject<EditorButtonsRef>;
  tbodyRef: React.RefObject<HTMLElement>;
  playerRef: any;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  editorTabRef: { current: null },
  editorButtonsRef: { current: null },
  editorSettingsRef: { current: null },
  tbodyRef: { current: null },
  playerRef: null,
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const editorTabRef = useRef(null);
  const editorButtonsRef = useRef(null);
  const editorSettingsRef = useRef(null);
  const tbodyRef = useRef(null);
  const playerRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "editorTab":
        editorTabRef.current = ref;
        break;
      case "editorButtonsRef":
        editorButtonsRef.current = ref;
        break;
      case "editorSettingsRef":
        editorSettingsRef.current = ref;
        break;
      case "tbody":
        tbodyRef.current = ref;
        break;
      case "playerRef":
        playerRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider
      value={{ editorTabRef, tbodyRef, playerRef, editorButtonsRef, editorSettingsRef, setRef }}
    >
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    editorTabRef: context.editorTabRef,
    tbodyRef: context.tbodyRef,
    playerRef: context.playerRef,
    setRef: context.setRef,
  };
};
