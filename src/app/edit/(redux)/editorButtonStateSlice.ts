import { createSlice } from "@reduxjs/toolkit";

export const editorButtonStateSlice = createSlice({
  name: "editorButtonState",

  initialState: {
    add: false,
    update: false,
    convert: false,
    delete: false,
  },

  reducers: {
    setAdd: (state, action) => {
      state.add = action.payload;
    },
    setUpdate: (state, action) => {
      state.update = action.payload;
    },
    setConvert: (state, action) => {
      state.convert = action.payload;
    },
    setDelete: (state, action) => {
      state.delete = action.payload;
    },
  },
});

export const { setAdd, setUpdate, setConvert, setDelete } = editorButtonStateSlice.actions;

export default editorButtonStateSlice.reducer;
