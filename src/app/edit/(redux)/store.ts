import { configureStore } from "@reduxjs/toolkit";
import YTStateReducer from "./ytStateSlice";
import tabIndexReducer from "./tabIndexSlice";
import mapDataReducer from "./mapDataSlice";
import lineIndexReducer from "./lineIndexSlice";
import buttonFlagsReducer from "./buttonFlagsSlice";
import ytTitleReducer from "./tabInfoInputSlice";
import undoRedoReducer from "./undoredoSlice"; // 追加
import genreTagReducer from "./GenreTagSlice";

const store = configureStore({
  reducer: {
    ytState: YTStateReducer,
    tabIndex: tabIndexReducer,
    mapData: mapDataReducer,
    lineIndex: lineIndexReducer,
    btnFlags: buttonFlagsReducer,
    tabInfoInput: ytTitleReducer,
    undoRedo: undoRedoReducer,
    genreTag: genreTagReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
