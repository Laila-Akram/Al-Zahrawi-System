import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DashboardLayout from "./components/common/DashboardLayout";

import DoctorDashboard from "./components/doctor/DoctorDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

const RoleRoute = ({ allowedRole, children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return user?.role === allowedRole ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Doctor Dashboard */}
        <Route
          path="/doctor/dashboard"
          element={
            <RoleRoute allowedRole="doctor">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRole="admin">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;