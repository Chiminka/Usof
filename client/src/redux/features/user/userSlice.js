import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  users: [],
  loading: false,
};

export const createUser = createAsyncThunk(
  "user/createUser",
  async (formData) => {
    try {
      const { data } = await axios.post("/users", formData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const removeUser = createAsyncThunk("user/removeUser", async (id) => {
  try {
    const { data } = await axios.delete(`/users/${id}`, id);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData) => {
    try {
      const { data } = await axios.patch(`/users/${formData.id}`, formData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    // Обновление категории
    [updateUser.pending]: (state) => {
      state.loading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      state.users[index] = action.payload;
    },
    [updateUser.rejected]: (state) => {
      state.loading = false;
    },
    // Удаление категории
    [removeUser.pending]: (state) => {
      state.loading = true;
    },
    [removeUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = state.users.filter(
        (user) => user._id !== action.payload._id
      );
    },
    [removeUser.rejected]: (state) => {
      state.loading = false;
    },
    // Создание пользователя
    [createUser.pending]: (state) => {
      state.loading = true;
    },
    [createUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    },
    [createUser.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default userSlice.reducer;
