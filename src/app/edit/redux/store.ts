import { configureStore } from "@reduxjs/toolkit";
import mapDataReducer from "./mapDataSlice";
import buttonFlagsReducer from "./buttonFlagsSlice";
import undoRedoReducer from "./undoredoSlice"; // 追加
import genreTagReducer from "./GenreTagSlice";

const editStore = configureStore({
  reducer: {
    mapData: mapDataReducer,
    btnFlags: buttonFlagsReducer,
    undoRedo: undoRedoReducer,
    genreTag: genreTagReducer,
  },
});

export type RootState = ReturnType<typeof editStore.getState>;

export default editStore;
