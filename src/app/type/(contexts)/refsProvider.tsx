"use client";
import React, { createContext, useContext, useRef } from "react";
import { PlayingCenterRef } from "../components/(typing-area)/scene/child/PlayingCenter";
import { SkipGuideRef } from "../components/(typing-area)/scene/child/child/PlayingSkipGuide";

export interface RefsContextType {
  playerRef: any;
  playingCenterRef: React.RefObject<PlayingCenterRef>;
  skipGuideRef: React.RefObject<SkipGuideRef>;

  lineCountRef: React.MutableRefObject<number>; // 修正

  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  playerRef: null,
  playingCenterRef: { current: null },
  skipGuideRef: { current: null },
  lineCountRef: { current: 0 }, // 修正
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const playerRef = useRef(null);
  const playingCenterRef = useRef(null);
  const skipGuideRef = useRef(null);
  const lineCountRef = useRef(0);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "playingCenterRef":
        playingCenterRef.current = ref;
        break;

      case "playerRef":
        playerRef.current = ref;
        break;

      case "skipGuideRef":
        skipGuideRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider
      value={{ skipGuideRef, lineCountRef, playingCenterRef, playerRef, setRef }}
    >
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    playerRef: context.playerRef,
    playingCenterRef: context.playingCenterRef,
    lineCountRef: context.lineCountRef,
    skipGuideRef: context.skipGuideRef,
    setRef: context.setRef,
  };
};
