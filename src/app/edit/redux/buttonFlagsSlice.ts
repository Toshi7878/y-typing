import { createSlice } from "@reduxjs/toolkit";

export const buttonFlagsSlice = createSlice({
  name: "buttonLoad",

  initialState: {
    isLoadingWordConvertBtn: false,
    isLrcConverting: false,
    canUpload: false,
  },

  reducers: {
    setIsLoadingWordConvertBtn: (state, action) => {
      state.isLoadingWordConvertBtn = action.payload;
    },

    setCanUpload: (state, action) => {
      state.canUpload = action.payload;
    },

    setIsLrcConverting: (state, action) => {
      state.isLrcConverting = action.payload;
    },
  },
});

export const { setIsLoadingWordConvertBtn, setCanUpload, setIsLrcConverting } =
  buttonFlagsSlice.actions;

export default buttonFlagsSlice.reducer;
