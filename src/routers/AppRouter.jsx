import { createBrowserRouter, Navigate, RouterProvider, } from "react-router";
import AdminLayout from "../layouts/AdminLayout.jsx";
import HomeLayout from "../layouts/HomeLayout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import PropertyDetailPage from "../pages/PropertyDetailPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import OwnerApplicationDetail from "../pages/admin/OwnerApplicationDetail.jsx";
import OwnerApplications from "../pages/admin/OwnerApplications.jsx";
import PropertyApprovalDetail from "../pages/admin/PropertyApprovalDetail.jsx";
import PropertyApprovals from "../pages/admin/PropertyApprovals.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import ConversationList from "../pages/conversations/ConversationList.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import HomePage from "../pages/HomePage.jsx";
import OwnerLayout from "../layouts/OwnerLayout.jsx";
import OwnerDashboard from "../pages/owner/OwnerDashboardPage.jsx";
import OwnerPlaceholder from "../pages/owner/OwnerPlaceholderPage.jsx";
import RoomDetail from "../pages/properties/RoomDetail.jsx";

const guestRouter = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/properties" replace />,
      },
      {
        path: "properties",
        Component: HomePage,
      },
      {
        path: "properties/:propertyId",
        Component: PropertyDetailPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/properties" replace />,
  },
]);

const adminRouter = createBrowserRouter([
    {
        path: "/admin",
        Component: AdminLayout,
        children: [
            { index: true, Component: AdminDashboard, },
            { path: "users", Component: UserManagement },
            { path: "owner-applications", Component: OwnerApplications },
            { path: "owner-applications/:applicationId", Component: OwnerApplicationDetail },
            { path: "properties", Component: PropertyApprovals },
            { path: "properties/:propertyId", Component: PropertyApprovalDetail },
            { path: "conversations", Component: ConversationList },
        ],
    },
    { path: "*", element: <Navigate to="/admin" replace /> },
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/properties" replace />,
      },
      {
        path: "properties",
        Component: HomePage,
      },
      {
        path: "properties/:propertyId",
        Component: PropertyDetailPage,
      },
      {
        path: "properties/:propertyId/rooms",
        Component: RoomDetail,
      },
    ],
  },
  {
    path: "/login",
    element: <Navigate to="/properties" replace />,
  },
  {
    path: "/register",
    element: <Navigate to="/properties" replace />,
  },
  {
    path: "/admin/*",
    element: <Navigate to="/properties" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/properties" replace />,
  },
]);

const ownerRouter = createBrowserRouter([
    {
        path: "/owner",
        Component: OwnerLayout,
        children: [
            { index: true, Component: OwnerDashboard },
            { path: "properties", Component: OwnerPlaceholder },
            { path: "properties/new", Component: OwnerPlaceholder },
            { path: "rooms", Component: OwnerPlaceholder },
            { path: "rentals", Component: OwnerPlaceholder },
            { path: "messages", Component: OwnerPlaceholder },
            { path: "profile", Component: OwnerPlaceholder },
        ],
    },
    { path: "*", element: <Navigate to="/owner" replace /> },
]);

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
    const { token, user } = getStoredAuthentication();

    const finalRouter = !token
        ? guestRouter
        : user.role === "ADMIN"
            ? adminRouter
            : user.role === "OWNER"
                ? ownerRouter
                : userRouter;

    return <RouterProvider router={finalRouter} />;
};

export default AppRouter;
