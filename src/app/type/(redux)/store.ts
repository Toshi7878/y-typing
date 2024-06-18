import { configureStore } from "@reduxjs/toolkit";
import YTStateReducer from "./ytStateSlice";
import tabIndexReducer from "./tabIndexSlice";
import mapDataReducer from "./mapDataSlice";
import lineIndexReducer from "./lineIndexSlice";
import genreTagReducer from "./GenreTagSlice";

const store = configureStore({
  reducer: {
    ytState: YTStateReducer,
    tabIndex: tabIndexReducer,
    mapData: mapDataReducer,
    lineIndex: lineIndexReducer,
    // genreTag: genreTagReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
