import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  posts: [],
  popularPosts: [],
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

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData) => {
    try {
      // let categories = JSON.parse(category);
      const { data } = await axios.post("/posts", formData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPosts = createAsyncThunk("post/getAllPosts", async () => {
  try {
    const { data } = await axios.get("/posts");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const removePost = createAsyncThunk("post/removePost", async (id) => {
  try {
    const { data } = await axios.delete(`/posts/${id}`, id);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (formData) => {
    try {
      const { data } = await axios.patch(`/posts/${formData.id}`, formData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: {
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
    // Создание поста
    [createPost.pending]: (state) => {
      state.loading = true;
    },
    [createPost.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts.push(action.payload);
    },
    [createPost.rejected]: (state) => {
      state.loading = false;
    },
    // Получаение всех постов
    [getAllPosts.pending]: (state) => {
      state.loading = true;
    },
    [getAllPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload.posts;
      state.popularPosts = action.payload.popularPosts;
    },
    [getAllPosts.rejected]: (state) => {
      state.loading = false;
    },
    // Удаление поста
    [removePost.pending]: (state) => {
      state.loading = true;
    },
    [removePost.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload._id
      );
    },
    [removePost.rejected]: (state) => {
      state.loading = false;
    },
    // Обновление поста
    [updatePost.pending]: (state) => {
      state.loading = true;
    },
    [updatePost.fulfilled]: (state, action) => {
      state.loading = false;
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      state.posts[index] = action.payload;
    },
    [updatePost.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default postSlice.reducer;
