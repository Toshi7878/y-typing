import { createSlice } from "@reduxjs/toolkit";

export const buttonFlagsSlice = createSlice({
  name: "buttonLoad",

  initialState: {
    isLoadingWordConvertBtn: false,

    canUpload: false,
  },

  reducers: {
    setIsLoadingWordConvertBtn: (state, action) => {
      state.isLoadingWordConvertBtn = action.payload;
    },

    setCanUpload: (state, action) => {
      state.canUpload = action.payload;
    },
  },
});

export const { setIsLoadingWordConvertBtn, setCanUpload } = buttonFlagsSlice.actions;

export default buttonFlagsSlice.reducer;
