import { configureStore } from "@reduxjs/toolkit";
import mapDataReducer from "./mapDataSlice";
import undoRedoReducer from "./undoredoSlice"; // 追加

const editStore = configureStore({
  reducer: {
    mapData: mapDataReducer,
    undoRedo: undoRedoReducer,
  },
});

export type RootState = ReturnType<typeof editStore.getState>;

export default editStore;
