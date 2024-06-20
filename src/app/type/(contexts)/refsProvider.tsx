"use client";
import React, { createContext, useContext, useRef } from "react";
import { PlayingHandle } from "../components/(typing-area)/scene/Playing";

export interface RefsContextType {
  playerRef: any;
  playingSceneRef: React.RefObject<PlayingHandle>;

  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  playerRef: null,
  playingSceneRef: { current: null },
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const playerRef = useRef(null);
  const playingSceneRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "playingSceneRef":
        playingSceneRef.current = ref;
        break;

      case "playerRef":
        playerRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider value={{ playingSceneRef, playerRef, setRef }}>
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    playerRef: context.playerRef,
    playingSceneRef: context.playingSceneRef,
    setRef: context.setRef,
  };
};
