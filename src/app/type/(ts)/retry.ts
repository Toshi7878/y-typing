import { defaultStatusRef } from "../(contexts)/refsProvider";
import { StatusRef } from "./type";

export const proceedRetry = (
  playMode: "playing" | "replay",
  statusRef: React.RefObject<StatusRef>,
  setScene: (scene: "playing" | "replay") => void,
  tabStatusRef: React.RefObject<{ resetStatus: () => void } | null>,
  playingComboRef: React.RefObject<{ setCombo: (combo: number) => void } | null>,
  gameStateRef: React.RefObject<{
    replayKeyCount: number;
    isRetrySkip: boolean;
    replayData: any[];
  } | null>,
  playerRef: React.MutableRefObject<{ seekTo: (time: number) => void; playVideo: () => void }>,
) => {
  setScene(playMode);
  (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
  tabStatusRef.current!.resetStatus();
  playingComboRef.current!.setCombo(0);
  gameStateRef.current!.replayKeyCount = 0;

  gameStateRef.current!.isRetrySkip = true;
  playerRef.current.seekTo(0);
  playerRef.current.playVideo();
};
