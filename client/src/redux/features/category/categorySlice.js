import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  categories: [],
  loading: false,
};

export const getPostCategories = createAsyncThunk(
  "category/getPostCategories",
  async (postId) => {
    try {
      const { data } = await axios.get(`/posts/${postId}/categories`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    // Получение категорий
    [getPostCategories.pending]: (state) => {
      state.loading = true;
    },
    [getPostCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    [getPostCategories.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default categorySlice.reducer;
