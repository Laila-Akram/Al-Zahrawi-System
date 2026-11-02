
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DashboardLayout from "./components/common/DashboardLayout";
import DoctorDashboard from "./components/doctor/DoctorDashboard";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/doctor/dashboard"
          element={
            user?.role === "doctor" ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route index element={<DoctorDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
