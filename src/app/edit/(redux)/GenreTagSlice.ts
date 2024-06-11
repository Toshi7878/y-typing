import { createSlice } from "@reduxjs/toolkit";
import { Tag } from "../(tab-content)/(components)/InfoGenreTag";

export interface GenreTag {
  tags: Array<Tag>;
  genre: string;
}

const initialState: GenreTag = {
  genre: "",
  tags: [],
};

export const genreTagSlice = createSlice({
  name: "genreTag",

  initialState,

  reducers: {
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
    setTags: (state, action) => {
      state.tags = [...state.tags, action.payload];
    },

    deleteTags: (state, action) => {
      state.tags = [...action.payload];
    },
  },
});
export const { setGenre, setTags, deleteTags } = genreTagSlice.actions;

export default genreTagSlice.reducer;
