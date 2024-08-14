import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginAuthentication from "./auth/LoginAuthentication";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/dashboardContents/Employee";
import Menu from "./pages/dashboardContents/Menu";
import DashboardContent from "./pages/dashboardContents/DashboardContent";
import Category from "./pages/dashboardContents/Category";
import Staff from "./pages/Staff";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import ProfileSettings from "./pages/dashboardContents/ProfileSettings";

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginAuthentication />} />
        <Route path="/staff-page" element={<Staff />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        >
          <Route index element={<DashboardContent />} />
          <Route path="employee" element={<Employee />} />
          <Route path="menu" element={<Menu />} />
          <Route path="category" element={<Category />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
