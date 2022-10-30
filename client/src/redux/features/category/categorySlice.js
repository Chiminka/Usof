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

export const getCategoryPosts = createAsyncThunk(
  "category/getCategoryPosts",
  async (postId) => {
    try {
      const { data } = await axios.get(`/categories/${postId}/posts`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async () => {
    try {
      const { data } = await axios.get(`/categories`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (formData) => {
    try {
      const { data } = await axios.post("/categories", formData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const removeCategory = createAsyncThunk(
  "category/removeCategory",
  async ({ id, post_id }) => {
    try {
      const { data } = await axios.delete(`/categories/${id}`, {
        data: {
          post_id: post_id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, title, description }) => {
    try {
      const { data } = await axios.patch(`/categories/${id}`, {
        title,
        description,
      });
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
    // Обновление категории
    [updateCategory.pending]: (state) => {
      state.loading = true;
    },
    [updateCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const index = state.categories.findIndex(
        (category) => category._id === action.payload._id
      );
      state.categories[index] = action.payload;
    },
    [updateCategory.rejected]: (state) => {
      state.loading = false;
    },
    // Удаление категории
    [removeCategory.pending]: (state) => {
      state.loading = true;
    },
    [removeCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload._id
      );
    },
    [removeCategory.rejected]: (state) => {
      state.loading = false;
    },
    // Создание категории
    [createCategory.pending]: (state) => {
      state.loading = true;
    },
    [createCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
    },
    [createCategory.rejected]: (state) => {
      state.loading = false;
    },
    // Получаение всех категорий
    [getAllCategories.pending]: (state) => {
      state.loading = true;
    },
    [getAllCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories;
    },
    [getAllCategories.rejected]: (state) => {
      state.loading = false;
    },
    // Получение категорий поста
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
    // Получение постов категории
    [getCategoryPosts.pending]: (state) => {
      state.loading = true;
    },
    [getCategoryPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    },
    [getCategoryPosts.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default categorySlice.reducer;
