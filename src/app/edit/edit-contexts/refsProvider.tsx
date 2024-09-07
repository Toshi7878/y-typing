"use client";
import React, { createContext, useContext, useRef } from "react";
import { EditorTimeInputRef, EditStatusRef } from "../ts/type";
import { DEFAULT_EDIT_STATUS_REF } from "../ts/const/editDefaultValues";

export interface RefsContextType {
  editorTimeInputRef: React.RefObject<EditorTimeInputRef>;
  tbodyRef: React.RefObject<HTMLElement>;
  playerRef: any;
  editStatus: React.RefObject<EditStatusRef>;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

const RefsContext = createContext<RefsContextType>({
  editorTimeInputRef: { current: null },
  tbodyRef: { current: null },
  playerRef: null,
  editStatus: { current: DEFAULT_EDIT_STATUS_REF },
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const editorTimeInputRef = useRef(null);
  const tbodyRef = useRef(null);
  const playerRef = useRef(null);
  const editStatus = useRef(DEFAULT_EDIT_STATUS_REF);
  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
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
        editStatus,
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
    editorTimeInputRef: context.editorTimeInputRef,
    editStatus: context.editStatus,
    setRef: context.setRef,
  };
};
