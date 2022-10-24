import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  posts: [],
  popularPosts: [],
  likes: [],
  loading: false,
};

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

export const createLike_Dislike = createAsyncThunk(
  "post/createLike_Dislike",
  async ({ postId, type }) => {
    try {
      const { data } = await axios.post(`/posts/${postId}/like`, {
        postId,
        type,
      });
      console.log({ postId, type });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getLike_Dislike = createAsyncThunk(
  "post/getLike_Dislike",
  async (id) => {
    try {
      const { data } = await axios.get(`/posts/${id}/like`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteLike_Dislike = createAsyncThunk(
  "post/deleteLike_Dislike",
  async ({ postId }) => {
    try {
      const { data } = await axios.delete(`/posts/${postId}/like`, postId);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPosts = createAsyncThunk("post/getAllPosts", async () => {
  try {
    const { data } = await axios.get(`/posts`);
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
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    // Получаение лайков
    [getLike_Dislike.pending]: (state) => {
      state.loading = true;
    },
    [getLike_Dislike.fulfilled]: (state, action) => {
      state.loading = false;
      state.likes = action.payload.likes;
    },
    [getLike_Dislike.rejected]: (state) => {
      state.loading = false;
    },
    // Удаление лайка
    [deleteLike_Dislike.pending]: (state) => {
      state.loading = true;
    },
    [deleteLike_Dislike.fulfilled]: (state, action) => {
      state.loading = false;
      state.likes = state.likes.filter(
        (like) => like._id !== action.payload._id
      );
    },
    [deleteLike_Dislike.rejected]: (state) => {
      state.loading = false;
    },
    // Создание лайка
    [createLike_Dislike.pending]: (state) => {
      state.loading = true;
    },
    [createLike_Dislike.fulfilled]: (state, action) => {
      state.loading = false;
      state.likes.push(action.payload);
    },
    [createLike_Dislike.rejected]: (state) => {
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
