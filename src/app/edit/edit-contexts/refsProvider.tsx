"use client";
import React, { createContext, useContext, useRef } from "react";
import { EditorButtonsRef, EditorTimeInputRef } from "../ts/type";

export interface RefsContextType {
  editorButtonsRef: React.RefObject<EditorButtonsRef>;
  editorTimeInputRef: React.RefObject<EditorTimeInputRef>;
  tbodyRef: React.RefObject<HTMLElement>;
  playerRef: any;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

const RefsContext = createContext<RefsContextType>({
  editorButtonsRef: { current: null },
  editorTimeInputRef: { current: null },
  tbodyRef: { current: null },
  playerRef: null,
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const editorButtonsRef = useRef(null);
  const editorTimeInputRef = useRef(null);
  const tbodyRef = useRef(null);
  const playerRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "editorButtonsRef":
        editorButtonsRef.current = ref;
        break;
      case "editorTimeInputRef":
        editorTimeInputRef.current = ref;
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
      value={{
        tbodyRef,
        playerRef,
        editorButtonsRef,
        editorTimeInputRef,
        setRef,
      }}
    >
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    tbodyRef: context.tbodyRef,
    playerRef: context.playerRef,
    editorButtonsRef: context.editorButtonsRef,
    editorTimeInputRef: context.editorTimeInputRef,
    setRef: context.setRef,
  };
};
