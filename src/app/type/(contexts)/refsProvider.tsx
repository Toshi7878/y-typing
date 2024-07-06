"use client";
import React, { createContext, useContext, useRef } from "react";
import { TabStatusRef } from "../components/(tab)/tab/TabStatus";

export interface RefsContextType {
  playerRef: any;
  tabStatusRef: React.RefObject<TabStatusRef>;
  lineCountRef: React.MutableRefObject<number>;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  playerRef: null,
  tabStatusRef: { current: null },
  lineCountRef: { current: 0 },

  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const playerRef = useRef(null);
  const tabStatusRef = useRef(null);
  const lineCountRef = useRef(0);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "playerRef":
        playerRef.current = ref;
        break;

      case "tabStatusRef":
        tabStatusRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider value={{ tabStatusRef, lineCountRef, playerRef, setRef }}>
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    playerRef: context.playerRef,
    lineCountRef: context.lineCountRef,
    tabStatusRef: context.tabStatusRef,
    setRef: context.setRef,
  };
};
