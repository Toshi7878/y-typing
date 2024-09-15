import { useDispatch, useSelector } from "react-redux";
import {
  useSetEditTimeCountAtom,
  useSetIsEditYTPlayingAtom,
  useSetIsEditYTReadyAtom,
  useSetIsEditYTStartedAtom,
  useSetTabIndexAtom,
} from "../edit-atom/editAtom";
import { useRefs } from "../edit-contexts/refsProvider";
import { timer } from "../ts/youtube-ts/editTimer";
import { RootState } from "../redux/store";
import { LineEdit } from "@/types";
import { updateLine } from "../redux/mapDataSlice";
import NProgress from "nprogress";
import { useVolumeAtom } from "@/components/atom/globalAtoms";
import { editTicker } from "../components/editor-youtube-content/EditYoutube";

export const useYTReadyEvent = () => {
  const { setRef } = useRefs();
  const setIsReady = useSetIsEditYTReadyAtom();
  const dispatch = useDispatch();
  const volume = useVolumeAtom();
  const mapData = useSelector((state: RootState) => state.mapData.value);

  return (event) => {
    console.log("ready");
    NProgress.done();
    const player = event.target;
    setRef("playerRef", player);
    const duration = player.getDuration();
    player.setVolume(volume);
    setIsReady(true);

    if (mapData.length === 2) {
      dispatch(
        updateLine({
          time: duration.toFixed(3),
          lyrics: "end",
          word: "",
          selectedLineCount: 1,
        }),
      );
    }
  };
};

export const useYTPlayEvent = () => {
  const { editStatus, playerRef } = useRefs();
  const setIsYTPlaying = useSetIsEditYTPlayingAtom();
  const setIsYTStarted = useSetIsEditYTStartedAtom();
  const setTabIndex = useSetTabIndexAtom();
  const tickerFunction = () => timer.update(playerRef);

  const onPlay = (event) => {
    console.log("再生 1");

    editTicker.start();
    setIsYTPlaying(true);
    setIsYTStarted(true);
    if (!editStatus.current?.isNotAutoTabToggle) {
      setTabIndex(1);
    }

    editStatus.current!.isNotAutoTabToggle = false;
  };

  return { onPlay, tickerFunction };
};

export const useYTPauseEvent = () => {
  const setIsYTPlaying = useSetIsEditYTPlayingAtom();

  return () => {
    console.log("一時停止");
    editTicker.stop();
    setIsYTPlaying(false);
  };
};

export const useYTEndStopEvent = () => {
  const setIsYTPlaying = useSetIsEditYTPlayingAtom();

  return () => {
    console.log("プレイ終了 動画完全停止");
    editTicker.stop();
    setIsYTPlaying(false);
  };
};

export const useYTSeekEvent = () => {
  const setTimeCount = useSetEditTimeCountAtom();
  const mapData = useSelector((state: RootState) => state.mapData.value);

  return (event: any) => {
    const time = event.target.getCurrentTime()!;
    console.log(`シークtime: ${time}`);
    setTimeCount(getCount(time, mapData));
  };
};

function getCount(time: number, mapData: LineEdit[]) {
  let count = 0;

  for (let i = 0; i < mapData.length; i++) {
    if (Number(mapData[i]["time"]) - time >= 0) {
      count = i - 1;
      break;
    }
  }

  if (count < 0) {
    count = 0;
  }

  return count;
}
