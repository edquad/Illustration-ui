import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "../components/AppProvider";
import { Layout } from "../components/layout";
import Login from "../pages/Login";
import Illustration from "../pages/Illustration";
import Admin from "../pages/Admin";

const RequireAuth = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/*"
      element={
        <RequireAuth>
          <Layout>
            <Routes>
              <Route path="/*" element={<Illustration />} />
              <Route path="/Illustration" element={<Illustration />} />
              <Route path="/Admin" element={<Admin />} />
            </Routes>
          </Layout>
        </RequireAuth>
      }
    />
  </Routes>
);

export default AppRoutes;