import React, { createContext, useContext, useRef } from "react";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const playerRef = useRef(null);

  const setPlayerRef = (player) => {
    playerRef.current = player;
  };
  return (
    <PlayerContext.Provider value={{ playerRef, setPlayerRef } as any}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext) as any;
