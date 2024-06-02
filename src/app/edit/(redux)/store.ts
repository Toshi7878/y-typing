import { configureStore } from "@reduxjs/toolkit";
import playingReducer from "./playingSlice";
import tabIndexReducer from "./tabIndexSlice";
import selectLineReducer from "./selectLineSlice";
import mapDataReducer from "./mapDataSlice";

const store = configureStore({
  reducer: {
    playing: playingReducer,
    tabIndex: tabIndexReducer,
    selectLine: selectLineReducer,
    mapData: mapDataReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
