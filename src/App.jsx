import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/registerPage.jsx";

import PropertyList from "./pages/PropertyList.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";

import AdminLayout from "./components/layout/adminLayout.jsx";
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import UserManagement from "./pages/admin/userManagement.jsx";
import OwnerApplications from "./pages/admin/ownerApplications.jsx";
import PropertyApprovals from "./pages/admin/propertyApprovals.jsx";
import ConversationList from "./pages/conversations/ConversationList.jsx";
import OwnerApplicationDetail from "./pages/admin/ownerApplicationDetail.jsx";
import PropertyApprovalDetail from "./pages/admin/propertyApprovalDetail.jsx";

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
  const hasToken = Boolean(
    localStorage.getItem("token")
  );
  const currentUser = getStoredUser();
  const isAdmin =
    hasToken && currentUser?.role === "ADMIN";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Navigate to="/properties" replace />
          }
        />

        <Route
          path="/properties"
          element={<PropertyList />}
        />

        <Route
          path="/properties/:propertyId"
          element={<PropertyDetail />}
        />

        {/* Authentication routes */}
        <Route
          path="/login"
          element={
            hasToken ? (
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
            hasToken ? (
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
                to={hasToken ? "/properties" : "/login"}
                replace
              />
            )
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route
            path="users"
            element={<UserManagement />}
          />

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
          element={
            <Navigate to="/properties" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
