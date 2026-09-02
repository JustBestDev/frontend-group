import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import PropertyDetail from "../pages/PropertyDetail.jsx";
import PropertyList from "../pages/PropertyList.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import OwnerApplicationDetail from "../pages/admin/OwnerApplicationDetail.jsx";
import OwnerApplications from "../pages/admin/OwnerApplications.jsx";
import PropertyApprovalDetail from "../pages/admin/PropertyApprovalDetail.jsx";
import PropertyApprovals from "../pages/admin/PropertyApprovals.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import ConversationList from "../pages/conversations/ConversationList.jsx";

const clearStoredAuthentication = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getStoredAuthentication = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    if (token || storedUser) {
      clearStoredAuthentication();
    }

    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(storedUser);

    if (!user || typeof user !== "object") {
      throw new Error("Invalid stored user");
    }

    return { token, user };
  } catch {
    clearStoredAuthentication();
    return { token: null, user: null };
  }
};

const AppRouter = () => {
  const { token, user: currentUser } =
    getStoredAuthentication();
  const isAuthenticated = Boolean(token && currentUser);
  const isAdmin =
    isAuthenticated && currentUser.role === "ADMIN";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<Navigate to="/properties" replace />}
        />
        <Route path="/properties" element={<PropertyList />} />
        <Route
          path="/properties/:propertyId"
          element={<PropertyDetail />}
        />

        {/* Authentication routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={isAdmin ? "/admin" : "/properties"}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/properties" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminLayout />
            ) : (
              <Navigate
                to={isAuthenticated ? "/properties" : "/login"}
                replace
              />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route
            path="owner-applications"
            element={<OwnerApplications />}
          />
          <Route
            path="owner-applications/:applicationId"
            element={<OwnerApplicationDetail />}
          />
          <Route
            path="properties"
            element={<PropertyApprovals />}
          />
          <Route
            path="properties/:propertyId"
            element={<PropertyApprovalDetail />}
          />
          <Route
            path="conversations"
            element={<ConversationList />}
          />
        </Route>

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/properties" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
