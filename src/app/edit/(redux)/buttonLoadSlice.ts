import { createSlice } from "@reduxjs/toolkit";

export const buttonLoadSlice = createSlice({
  name: "buttonLoad",

  initialState: {
    isLoadingWordConvertBtn: false,

    isLoadingUploadBtn: false,
  },

  reducers: {
    setIsLoadingWordConvertBtn: (state, action) => {
      state.isLoadingWordConvertBtn = action.payload;
    },

    setIsLoadingUploadBtn: (state, action) => {
      state.isLoadingUploadBtn = action.payload;
    },
  },
});

export const { setIsLoadingWordConvertBtn, setIsLoadingUploadBtn } = buttonLoadSlice.actions;

export default buttonLoadSlice.reducer;
