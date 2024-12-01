import { useStore as useReduxStore } from "react-redux";
import { RootState } from "../redux/store";

export const useGetSeekCount = () => {
  const editReduxStore = useReduxStore<RootState>();

  return (time: number) => {
    let count = 0;
    const mapData = editReduxStore.getState().mapData.value;

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
  };
};
