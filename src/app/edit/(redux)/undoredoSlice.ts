import { createSlice } from "@reduxjs/toolkit";
import { Line } from "../(tab-content)/(ts)/buttonEvent";

export interface UndoRedoStatus {
  past: { type: string; data: Line }[];
  present: { type: string; data: Line } | null;
  future: { type: string; data: Line }[];
}

const initialState: UndoRedoStatus = {
  past: [],
  present: null,
  future: [],
};

const undoRedoSlice = createSlice({
  name: "undoRedo",
  initialState,
  reducers: {
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop();
        state.future.push(state.present!);
        state.present = previous!;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop();
        state.past.push(state.present!);
        state.present = next!;
      }
    },
    addHistory: (state, action) => {
      if (state.present !== null) {
        state.past.push(state.present);
      }
      state.present = action.payload;
      state.future = [];
    },
  },
});

export const { undo, redo, addHistory } = undoRedoSlice.actions;
export default undoRedoSlice.reducer;
