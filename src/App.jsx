import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

import PropertyList from "./pages/PropertyList.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import OwnerApplications from "./pages/admin/OwnerApplications.jsx";
import PropertyApprovals from "./pages/admin/PropertyApprovals.jsx";
import ConversationList from "./pages/conversations/ConversationList.jsx";
import OwnerApplicationDetail from "./pages/admin/OwnerApplicationDetail.jsx";
import PropertyApprovalDetail from "./pages/admin/PropertyApprovalDetail.jsx";
import RoomDetail from "./pages/properties/RoomDetail.jsx";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const App = () => {
  const hasToken = Boolean(localStorage.getItem("token"));
  const currentUser = getStoredUser();
  const isAdmin = hasToken && currentUser?.role === "ADMIN";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/properties" replace />} />

        <Route path="/properties" element={<PropertyList />} />

        <Route path="/properties/:propertyId" element={<PropertyDetail />} />

        {/* Room Route */}
        <Route path="room/:roomId" element={<RoomDetail />} />

        {/* Authentication routes */}
        <Route
          path="/login"
          element={
            hasToken ? (
              <Navigate to={isAdmin ? "/admin" : "/properties"} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/register"
          element={
            hasToken ? <Navigate to="/properties" replace /> : <RegisterPage />
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminLayout />
            ) : (
              <Navigate to={hasToken ? "/properties" : "/login"} replace />
            )
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<UserManagement />} />

          <Route path="owner-applications" element={<OwnerApplications />} />

          <Route
            path="owner-applications/:applicationId"
            element={<OwnerApplicationDetail />}
          />

          <Route path="properties" element={<PropertyApprovals />} />

          <Route
            path="properties/:propertyId"
            element={<PropertyApprovalDetail />}
          />

          <Route path="conversations" element={<ConversationList />} />
        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
