import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  comments: [],
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

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ postId, comment }) => {
    try {
      const { data } = await axios.post(`/posts/${postId}/comments`, {
        postId,
        comment,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPostComments = createAsyncThunk(
  "comment/getPostComments",
  async (postId) => {
    try {
      const { data } = await axios.get(`/posts/${postId}/comments`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const removeComment = createAsyncThunk(
  "comment/removeComment",
  async (id) => {
    try {
      const { data } = await axios.delete(`comments/${id}`, id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
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
    // Создание comment
    [createComment.pending]: (state) => {
      state.loading = true;
    },
    [createComment.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments.push(action.payload);
    },
    [createComment.rejected]: (state) => {
      state.loading = false;
    },
    // Получение комментов
    [getPostComments.pending]: (state) => {
      state.loading = true;
    },
    [getPostComments.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    },
    [getPostComments.rejected]: (state) => {
      state.loading = false;
    },
    // Удаление комментария
    [removeComment.pending]: (state) => {
      state.loading = true;
    },
    [removeComment.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload._id
      );
    },
    [removeComment.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default commentSlice.reducer;
