import { useDispatch, useSelector } from "react-redux";
import {
  useMapTitleAtom,
  useSetEditTimeCountAtom,
  useSetIsEditYTPlayingAtom,
  useSetIsEditYTReadyAtom,
  useSetIsEditYTStartedAtom,
  useSetMapTitleAtom,
  useSetTabIndexAtom,
} from "../edit-atom/editAtom";
import { useRefs } from "../edit-contexts/refsProvider";
import { timer } from "../ts/youtube-ts/editTimer";
import { useEditTicker } from "./useEditTicker";
import { RootState } from "../redux/store";
import { LineEdit } from "@/types";
import { updateLine } from "../redux/mapDataSlice";
import NProgress from "nprogress";
import { useVolumeAtom } from "@/components/atom/globalAtoms";

export const useYTReadyEvent = () => {
  const { setRef } = useRefs();
  const setMapTitle = useSetMapTitleAtom();
  const setIsReady = useSetIsEditYTReadyAtom();
  const dispatch = useDispatch();
  const volume = useVolumeAtom();
  const mapTitle = useMapTitleAtom();

  return (event) => {
    console.log("ready");
    NProgress.done();
    const player = event.target;
    setRef("playerRef", player);

    const videoData = player.getVideoData();
    const duration = player.getDuration();
    player.setVolume(volume);

    setIsReady(true);

    if (!mapTitle) {
      if (videoData) {
        const { title } = videoData;
        setMapTitle(title);
      }

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
  const { playerRef } = useRefs();
  const setIsYTPlaying = useSetIsEditYTPlayingAtom();
  const setIsYTStarted = useSetIsEditYTStartedAtom();
  const setTabIndex = useSetTabIndexAtom();
  const editTicker = useEditTicker();

  return (event) => {
    console.log("再生 1");
    editTicker.add(() => timer.update(playerRef));
    editTicker.start();
    setIsYTPlaying(true);
    setIsYTStarted(true);
    setTabIndex(1);
  };
};

export const useYTPauseEvent = () => {
  const editTicker = useEditTicker();
  const setIsYTPlaying = useSetIsEditYTPlayingAtom();

  return () => {
    console.log("一時停止");
    editTicker.stop();
    setIsYTPlaying(false);
  };
};

export const useYTEndStopEvent = () => {
  const editTicker = useEditTicker();
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
