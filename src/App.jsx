import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import OwnerApplications from "./pages/admin/OwnerApplications.jsx";
import PropertyApprovals from "./pages/admin/PropertyApprovals.jsx";

function App() {
  const hasToken = Boolean(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            hasToken
              ? <Navigate to="/admin" replace />
              : <LoginPage />
          }
        />

        <Route
          path="/admin"
          element={
            hasToken
              ? <AdminLayout />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route
            path="owner-applications"
            element={<OwnerApplications />}
          />

          <Route
            path="properties"
            element={<PropertyApprovals />}
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={hasToken ? "/admin" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;