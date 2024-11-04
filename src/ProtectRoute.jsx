// ProtectedRoute.js
import React, { useContext, createContext } from "react";
import { Navigate } from "react-router-dom";
export const APP_CONTEXT = createContext({});
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(APP_CONTEXT);

  // Kiểm tra nếu người dùng chưa đăng nhập (user là null hoặc không có token)
  const token = localStorage.getItem("token");
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children; // Trả về children nếu đã đăng nhập
};

export default ProtectedRoute;
