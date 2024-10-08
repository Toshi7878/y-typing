import { LineEdit } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface LineChange {
  old: LineEdit;
  new: LineEdit;
  lineNumber: string;
}

interface AllAdjustTime {
  times: string[];
  adjustTime: number;
}

export interface UndoRedoStatus {
  past: { type: string; data: LineEdit | LineChange | AllAdjustTime }[];
  present: { type: string; data: LineEdit | LineChange | AllAdjustTime } | null;
  future: { type: string; data: LineEdit | LineChange | AllAdjustTime }[];
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
    //ctrl+z押したとき
    undo: (state) => {
      state.future.push(state.present!);
      if (state.past.length > 0) {
        const previous = state.past.pop();
        state.present = previous!;
      } else {
        state.present = null;
      }
    },
    //ctrl+y押したとき
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop();
        state.past.push(state.present!);
        state.present = next!;
      } else {
      }
    },
    addHistory: (state, action) => {
      if (state.present !== null) {
        state.past.push(state.present);
      }
      state.present = action.payload;
      state.future = [];
    },

    addLastUpdateHistory: (state, action) => {
      state.future.push(action.payload);
    },

    resetUndoRedoData: (state) => {
      state.past = initialState.past;
      state.future = initialState.future;
      state.present = initialState.present;
    },
  },
});

export const { undo, redo, addHistory, addLastUpdateHistory, resetUndoRedoData } =
  undoRedoSlice.actions;
export default undoRedoSlice.reducer;
