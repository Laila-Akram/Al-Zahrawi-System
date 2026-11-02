import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DashboardLayout from "./components/common/DashboardLayout";

import DoctorDashboard from "./components/doctor/DoctorDashboard";
import SupplierDashboard from "./components/supplier/SupplierDashboard";
import MyOffers from "./components/supplier/MyOffers";

import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import CatalogManagement from "./components/admin/CatalogManagement";

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

        <Route
          path="/doctor"
          element={
            <RoleRoute allowedRole="doctor">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
        </Route>

        <Route
          path="/supplier"
          element={
            <RoleRoute allowedRole="supplier">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SupplierDashboard />} />
          <Route path="offers" element={<MyOffers />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRole="admin">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="catalog" element={<CatalogManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;