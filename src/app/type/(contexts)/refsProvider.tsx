"use client";
import { Line } from "@/types";
import React, { createContext, useContext, useRef } from "react";

export interface RefsContextType {
  playerRef: any;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  playerRef: null,
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const playerRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "playerRef":
        playerRef.current = ref;
        break;
    }
  };

  return <RefsContext.Provider value={{ playerRef, setRef }}>{children}</RefsContext.Provider>;
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    playerRef: context.playerRef,
    setRef: context.setRef,
  };
};
