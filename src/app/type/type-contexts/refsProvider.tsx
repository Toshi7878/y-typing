"use client";
import React, { createContext, useContext, useRef } from "react";
import { GameStateRef, RefsContextType, StatusRef, YTStateRef } from "../ts/type";
import {
  DEFAULT_GAME_STATE_REF,
  DEFAULT_STATUS_REF,
  DEFAULT_YT_STATE_REF,
} from "../ts/const/typeDefaultValue";

// Start of Selection
export const RefsContext = createContext<RefsContextType>({
  playerRef: null,
  tabStatusRef: { current: null },
  playingComboRef: { current: null },
  lineCountRef: { current: 0 },
  bestScoreRef: { current: 0 },
  statusRef: { current: structuredClone(DEFAULT_STATUS_REF) },
  ytStateRef: { current: structuredClone(DEFAULT_YT_STATE_REF) },
  gameStateRef: { current: structuredClone(DEFAULT_GAME_STATE_REF) },
  lineProgressRef: { current: null },
  playingLineTimeRef: { current: null },
  playingCenterRef: { current: null },

  setRef: (ref: HTMLElement | any) => {},
});

export const RefsProvider = ({ children }) => {
  const playerRef = useRef(null);
  const tabStatusRef = useRef(null);
  const playingComboRef = useRef(null);
  const lineCountRef = useRef(0);
  const bestScoreRef = useRef(0);
  const statusRef = useRef<StatusRef>(structuredClone(DEFAULT_STATUS_REF));
  const ytStateRef = useRef<YTStateRef>(structuredClone(DEFAULT_YT_STATE_REF));
  const gameStateRef = useRef<GameStateRef>(structuredClone(DEFAULT_GAME_STATE_REF));
  const lineProgressRef = useRef(null);
  const playingLineTimeRef = useRef(null);
  const playingCenterRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "playerRef":
        playerRef.current = ref;
        break;
      case "tabStatusRef":
        tabStatusRef.current = ref;
        break;
      case "playingComboRef":
        playingComboRef.current = ref;
        break;
      case "lineProgressRef":
        lineProgressRef.current = ref;
        break;
      case "playingLineTimeRef":
        playingLineTimeRef.current = ref;
        break;
      case "playingCenterRef":
        playingCenterRef.current = ref;
        break;
    }
  };

  return (
    <RefsContext.Provider
      value={{
        ytStateRef,
        gameStateRef,
        statusRef,
        playingComboRef,
        lineProgressRef,
        playingCenterRef,
        playingLineTimeRef,
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
    lineProgressRef: context.lineProgressRef,
    playingLineTimeRef: context.playingLineTimeRef,
    playingCenterRef: context.playingCenterRef,
    statusRef: context.statusRef,
    ytStateRef: context.ytStateRef,
    gameStateRef: context.gameStateRef,
    setRef: context.setRef,
  };
};
