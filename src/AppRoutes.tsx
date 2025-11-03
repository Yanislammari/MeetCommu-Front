import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Messages from "./pages/Messages";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
