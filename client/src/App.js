import { Layout } from "./components/Layout.jsx";
import { Routes, Route } from "react-router-dom";

import { MainPage } from "./pages/MainPage";
import { PostsPage } from "./pages/PostsPage";
import { PostPage } from "./pages/PostPage";
import { AddPostPage } from "./pages/AddPostPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { RecoverPage } from "./pages/RecoverPage";
import { EditPostPage } from "./pages/EditPostPage";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMe } from "./redux/features/auth/authSlice.js";
import { VerificationPage } from "./pages/VerificationPage";
import { VerifiedEmail } from "./pages/VerifiedEmail";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CategoryPage } from "./pages/CategoryPage";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="main" element={<MainPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="users/posts" element={<PostsPage />} />
        <Route path="posts/:id" element={<PostPage />} />
        <Route path=":id/edit" element={<EditPostPage />} />
        <Route path="new" element={<AddPostPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="recover" element={<RecoverPage />} />
        <Route path="recover/:token" element={<VerificationPage />} />
        <Route path="verify/:token" element={<VerifiedEmail />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:id" element={<CategoryPage />} />
      </Routes>

      <ToastContainer position="bottom-right" />
    </Layout>
  );
}

export default App;
