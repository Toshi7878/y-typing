"use client";
import { Line } from "@/types";
import React, { createContext, useContext, useRef } from "react";

export interface EditorTab {
  add: () => void;
  update: () => void;
  delete: () => void;
  undoAddLyrics: (undoLine: Line) => void;
  setAddLyrics: () => void;
  redoAddLyrics: (redoLine: Line) => void;
  lineInit: () => void;
  getVolume: () => number;
}

export interface RefsContextType {
  editorTabRef: React.RefObject<EditorTab>;
  tbodyRef: React.RefObject<HTMLElement>;
  playerRef: any;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  editorTabRef: { current: null },
  tbodyRef: { current: null },
  playerRef: null,
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const editorTabRef = useRef(null);
  const tbodyRef = useRef(null);
  const playerRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "editorTab":
        editorTabRef.current = ref;
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
    <RefsContext.Provider value={{ editorTabRef, tbodyRef, playerRef, setRef }}>
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
