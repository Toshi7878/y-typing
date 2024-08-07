import { defaultStatusRef } from "../(contexts)/refsProvider";
import { CreateMap } from "./createTypingWord";
import { GameStateRef, LineResultData, StatusRef } from "./type";

export const proceedRetry = (
  playMode: "playing" | "replay" | "practice",
  setLineResults: React.Dispatch<React.SetStateAction<LineResultData[]>>,
  map: CreateMap,
  statusRef: React.RefObject<StatusRef>,
  setScene: (scene: "playing" | "replay" | "practice") => void,
  tabStatusRef: React.RefObject<{ resetStatus: () => void } | null>,
  playingComboRef: React.RefObject<{ setCombo: (combo: number) => void } | null>,
  gameStateRef: React.RefObject<GameStateRef | null>,
  playerRef: React.MutableRefObject<{ seekTo: (time: number) => void; playVideo: () => void }>,
) => {
  setScene(playMode);
  (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);

  if (playMode === "playing") {
    setLineResults(structuredClone(map!.defaultLineResultData));
  }

  tabStatusRef.current!.resetStatus();
  playingComboRef.current!.setCombo(0);
  gameStateRef.current!.replay.replayKeyCount = 0;

  gameStateRef.current!.isRetrySkip = true;
  playerRef.current.seekTo(0);
  playerRef.current.playVideo();
};
