import { configureStore } from "@reduxjs/toolkit";
import playingReducer from "./playingSlice";
import tabIndexReducer from "./tabIndexSlice";
import mapDataReducer from "./mapDataSlice";
import lineIndexReducer from "./lineIndexSlice";

const store = configureStore({
  reducer: {
    playing: playingReducer,
    tabIndex: tabIndexReducer,
    mapData: mapDataReducer,
    lineIndex: lineIndexReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
