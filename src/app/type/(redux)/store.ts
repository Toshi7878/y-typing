import { configureStore } from "@reduxjs/toolkit";
import YTStateReducer from "./ytStateSlice";
import tabIndexReducer from "./tabIndexSlice";
import mapDataReducer from "./mapDataSlice";
import lineCountReducer from "./lineCountSlice";
import genreTagReducer from "./GenreTagSlice";

const typeStore = configureStore({
  reducer: {
    ytState: YTStateReducer,
    tabIndex: tabIndexReducer,
    mapData: mapDataReducer,
    lineCountReducer,
    // genreTag: genreTagReducer,
  },
});

export type RootState = ReturnType<typeof typeStore.getState>;

export default typeStore;
