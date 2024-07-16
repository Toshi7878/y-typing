"use client";
import React, { createContext, useContext, useRef } from "react";
import { TabStatusRef } from "../components/(tab)/tab/TabStatus";
import { GameStateRef, PlayingRef, StatusRef, YTStateRef } from "../(ts)/type";
import { PlayingComboRef } from "../components/(typing-area)/scene/child/child/PlayingCombo";

export const defaultStatusRef: StatusRef = {
  status: {
    count: 0,
    romaType: 0,
    kanaType: 0,
    flickType: 0,
    rkpm: 0,
    maxCombo: 0,
    missCombo: 0,
    totalTypeTime: 0,
    completeCount: 0,
    failureCount: 0,
    result: [],
  },
  lineStatus: { lineType: 0, lineMiss: 0, lineClearTime: 0, latency: 0, typeResult: [] },
};

export const defaultYTStateRef = {
  isPaused: false,
  currentTime: 0,
};
export const defaultGameStateRef = {
  isRetrySkip: false,
};
export interface RefsContextType {
  playerRef: any;
  tabStatusRef: React.RefObject<TabStatusRef>;
  playingRef: React.RefObject<PlayingRef>;
  playingComboRef: React.RefObject<PlayingComboRef>;
  lineCountRef: React.MutableRefObject<number>;
  bestScoreRef: React.MutableRefObject<number>;
  statusRef: React.RefObject<StatusRef>;
  ytStateRef: React.RefObject<YTStateRef>;
  gameStateRef: React.RefObject<GameStateRef>;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  playerRef: null,
  tabStatusRef: { current: null },
  playingComboRef: { current: null },
  playingRef: { current: null },
  lineCountRef: { current: 0 },
  bestScoreRef: { current: 0 },
  statusRef: { current: structuredClone(defaultStatusRef) },
  ytStateRef: { current: structuredClone(defaultYTStateRef) },
  gameStateRef: { current: structuredClone(defaultGameStateRef) },

  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const playerRef = useRef(null);
  const tabStatusRef = useRef(null);
  const playingRef = useRef(null);
  const playingComboRef = useRef(null);
  const lineCountRef = useRef(0);
  const bestScoreRef = useRef(0);
  const statusRef = useRef<StatusRef>(structuredClone(defaultStatusRef));
  const ytStateRef = useRef<YTStateRef>(structuredClone(defaultYTStateRef));
  const gameStateRef = useRef<GameStateRef>(structuredClone(defaultGameStateRef));

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "playerRef":
        playerRef.current = ref;
        break;
      case "tabStatusRef":
        tabStatusRef.current = ref;
        break;
      case "playingRef":
        playingRef.current = ref;
        break;
      case "playingComboRef":
        playingComboRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider
      value={{
        ytStateRef,
        gameStateRef,
        statusRef,
        playingRef,
        playingComboRef,
        bestScoreRef,
        tabStatusRef,
        lineCountRef,
        playerRef,
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
    playerRef: context.playerRef,
    lineCountRef: context.lineCountRef,
    bestScoreRef: context.bestScoreRef,
    tabStatusRef: context.tabStatusRef,
    playingComboRef: context.playingComboRef,
    playingRef: context.playingRef,
    statusRef: context.statusRef,
    ytStateRef: context.ytStateRef,
    gameStateRef: context.gameStateRef,
    setRef: context.setRef,
  };
};
