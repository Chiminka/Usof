import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import postSlice from "./features/post/postSlice";
import commentSlice from "./features/comment/commentSlice";
import categorySlice from "./features/category/categorySlice";
import userSlice from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authSlice,
    post: postSlice,
    comment: commentSlice,
    category: categorySlice,
  },
});
