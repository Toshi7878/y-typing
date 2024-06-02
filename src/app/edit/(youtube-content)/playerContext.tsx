import React, { createContext, useContext, useRef } from "react";
import ReactPlayer from "react-player";

interface PlayerContextType {
  playerRef: React.RefObject<ReactPlayer>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const playerRef = useRef<ReactPlayer>(null);

  return (
    <PlayerContext.Provider value={{ playerRef }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
