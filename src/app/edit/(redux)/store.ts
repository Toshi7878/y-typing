import { configureStore } from "@reduxjs/toolkit";
import playingReducer from "./playingSlice";
import tabIndexReducer from "./tabIndexSlice";
import mapDataReducer from "./mapDataSlice";
import lineIndexReducer from "./lineIndexSlice";
import buttonLoadReducer from "./buttonLoadSlice";
import editorButtonStateReducer from "./editorButtonStateSlice";
import ytTitleReducer from "./ytTitleSlice";

const store = configureStore({
  reducer: {
    playing: playingReducer,
    tabIndex: tabIndexReducer,
    mapData: mapDataReducer,
    lineIndex: lineIndexReducer,
    buttonLoad: buttonLoadReducer,
    editorButtonState: editorButtonStateReducer,
    ytTitle: ytTitleReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
