import { configureStore } from "@reduxjs/toolkit";
import mapDataReducer from "./mapDataSlice";
import buttonFlagsReducer from "./buttonFlagsSlice";
import undoRedoReducer from "./undoredoSlice"; // 追加

const editStore = configureStore({
  reducer: {
    mapData: mapDataReducer,
    btnFlags: buttonFlagsReducer,
    undoRedo: undoRedoReducer,
  },
});

export type RootState = ReturnType<typeof editStore.getState>;

export default editStore;
