import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  userID: localStorage.getItem("userId"),
  user: null,
  token: null,
  isLoading: false,
  status: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, password, email, repeatPassword }) => {
    try {
      const { data } = await axios.post("/auth/register", {
        username,
        password,
        email,
        repeatPassword,
      });
      // if (data.token) {
      //   window.localStorage.setItem("token", data.token);
      // }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const EmailUser = createAsyncThunk(
  "auth/EmailUser",
  async ({ token }) => {
    try {
      const { data } = await axios.get(`users/verify/${token}`, {});
      // if (data.token) {
      //   window.localStorage.setItem("token", data.token);
      // }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ usernameOrEmail, password }) => {
    try {
      const { data } = await axios.post("/auth/login", {
        usernameOrEmail,
        password,
      });

      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMe = createAsyncThunk("auth/getMe", async () => {
  try {
    const { data } = await axios.get("/auth/me");
    localStorage.setItem("userId", data.user._id);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const passwordForgot = createAsyncThunk(
  "auth/passwordForgot",
  async ({ email }) => {
    try {
      const { data } = await axios.post("/auth/recover", {
        email,
      });

      // if (data.token) {
      //   window.localStorage.setItem("token", data.token);
      // }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const verifyPassword = createAsyncThunk(
  "auth/verifyPassword",
  async ({ new_password, confirm_password, token }) => {
    try {
      const { data } = await axios.post(`/auth/recover/${token}`, {
        new_password,
        confirm_password,
      });

      // if (data.token) {
      //   window.localStorage.setItem("token", data.token);
      // }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.status = null;
    },
  },
  extraReducers: {
    // Register user
    [registerUser.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.payload.message;
      state.user = action.payload.user;
      // state.token = action.payload.token;
    },
    [registerUser.rejectWithValue]: (state, action) => {
      state.status = action.payload.message;
      state.isLoading = false;
    },
    // Login user
    [loginUser.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.payload.message;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    [loginUser.rejectWithValue]: (state, action) => {
      state.status = action.payload.message;
      state.isLoading = false;
    },
    // Проверка авторизации
    [getMe.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [getMe.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = null;
      state.user = action.payload?.user;
      state.token = action.payload?.token;
      state.userID = localStorage.getItem("userId");
    },
    [getMe.rejectWithValue]: (state, action) => {
      state.status = action.payload.message;
      state.isLoading = false;
    },
    // Forgot password
    [passwordForgot.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [passwordForgot.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.payload.message;
      state.user = action.payload.user;
      // state.token = action.payload.token;
    },
    [passwordForgot.rejectWithValue]: (state, action) => {
      state.status = action.payload.message;
      state.isLoading = false;
    },
    // Verify password
    [verifyPassword.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [verifyPassword.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.payload.message;
      state.user = action.payload.user;
      // state.token = action.payload.token;
    },
    [verifyPassword.rejectWithValue]: (state, action) => {
      state.status = action.payload.message;
      state.isLoading = false;
    },
    // Verify password
    [EmailUser.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [EmailUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.payload.message;
      state.user = action.payload.user;
      // state.token = action.payload.token;
    },
    [EmailUser.rejectWithValue]: (state, action) => {
      state.status = action.payload.message;
      state.isLoading = false;
    },
  },
});

export const checkIsAuth = (state) => {
  return state.auth.token;
};

export const { logout } = authSlice.actions;
export default authSlice.reducer;
