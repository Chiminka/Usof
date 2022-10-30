import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  comments: [],
  loading: false,
};

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

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ id, comment, stat }) => {
    try {
      console.log("stats", id, comment, stat);
      const status = stat;
      const { data } = await axios.patch(`comments/${id}`, {
        id,
        comment,
        status,
      });
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
    // Обновление коммента
    [updateComment.pending]: (state) => {
      state.loading = true;
    },
    [updateComment.fulfilled]: (state, action) => {
      state.loading = false;
      const index = state.comments.findIndex(
        (comment) => comment._id === action.payload._id
      );
      state.comments[index] = action.payload;
    },
    [updateComment.rejected]: (state) => {
      state.loading = false;
    },
    // Создание comment
    [updateComment.pending]: (state) => {
      state.loading = true;
    },
    [updateComment.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments.push(action.payload);
    },
    [updateComment.rejected]: (state) => {
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
