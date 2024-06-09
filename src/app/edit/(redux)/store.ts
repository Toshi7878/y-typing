import { configureStore } from "@reduxjs/toolkit";
import YTStateReducer from "./ytStateSlice";
import tabIndexReducer from "./tabIndexSlice";
import mapDataReducer from "./mapDataSlice";
import lineIndexReducer from "./lineIndexSlice";
import buttonLoadReducer from "./buttonLoadSlice";
import ytTitleReducer from "./ytTitleSlice";

const store = configureStore({
  reducer: {
    ytState: YTStateReducer,
    tabIndex: tabIndexReducer,
    mapData: mapDataReducer,
    lineIndex: lineIndexReducer,
    buttonLoad: buttonLoadReducer,
    ytTitle: ytTitleReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
