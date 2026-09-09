import { useMemo } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
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
import OwnerPropertiesPage from "../pages/owner/OwnerPropertiesPage.jsx";
import OwnerRoomsPage from "../pages/owner/OwnerRoomsPage.jsx";
import OwnerRentalsPage from "../pages/owner/OwnerRentalsPage.jsx";
import OwnerProfilePage from "../pages/owner/OwnerProfilePage.jsx";
import OwnerCreatePropertyPage from "../pages/owner/OwnerCreatePropertyPage.jsx";
import OwnerPropertyDetailPage from "../pages/owner/OwnerPropertyDetailPage.jsx";
import RoomDetail from "../pages/properties/RoomDetail.jsx";
import useAuthStore from "../stores/authStore.js";
import CreateRoomDetail from "../pages/properties/CreateRoomDetail.jsx";
import OwnerEditRoomPage from "../pages/owner/OwnerEditRoomPage.jsx";
import CommunityPage from "../pages/CommunityPage.jsx";
import MemberRequestPage from "../pages/MemberRequestPage.jsx";
import RentalRequestsPage from "../pages/RentalRequestsPage.jsx";
import OwnerRentalRequestsPage from "../pages/owner/OwnerRentalRequestsPage.jsx";
import UserDetail from "../pages/admin/UserDetail.jsx";

const createGuestRouter = () => createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, element: <Navigate to="/properties" replace />, },
      { path: "properties", Component: HomePage, },
      { path: "properties/:propertyId", Component: PropertyDetailPage, },
      { path: "login", Component: LoginPage, },
      { path: "register", Component: RegisterPage, },
    ],
  },
  { path: "*", element: <Navigate to="/properties" replace />, },
]);

const createAdminRouter = () => createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, element: <Navigate to="/properties" replace /> },
      { path: "properties", Component: HomePage },
      { path: "properties/:propertyId", Component: PropertyDetailPage },
      { path: "properties/:propertyId/:roomId", Component: RoomDetail, },
      { path: "community", Component: CommunityPage },
      { path: "community/:postId/join-requests", Component: MemberRequestPage },
      { path: "message", Component: ConversationList },
    ]
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard, },
      { path: "users", Component: UserManagement },
      { path: "users/:userId", Component: UserDetail },
      { path: "owner-applications", Component: OwnerApplications },
      { path: "owner-applications/:applicationId", Component: OwnerApplicationDetail },
      { path: "properties", Component: PropertyApprovals },
      { path: "properties/:propertyId", Component: PropertyApprovalDetail },
      { path: "conversations", Component: ConversationList },
    ],
  },
  { path: "*", element: <Navigate to="/admin" replace /> },
]);

const createUserRouter = () => createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, element: <Navigate to="/properties" replace />, },
      { path: "properties", Component: HomePage, },
      { path: "community", Component: CommunityPage, },
      { path: "community/:postId/join-requests", Component: MemberRequestPage },
      { path: "Message", Component: ConversationList, },
      { path: "rental-requests", Component: RentalRequestsPage, },
      { path: "properties/:propertyId", Component: PropertyDetailPage, },
      { path: "properties/:propertyId/:roomId", Component: RoomDetail, },
    ],
  },
  { path: "*", element: <Navigate to="/properties" replace /> },
]);

const createOwnerRouter = () => createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, element: <Navigate to="/properties" replace /> },
      { path: "properties", Component: HomePage },
      { path: "properties/:propertyId", Component: PropertyDetailPage },
      { path: "properties/:propertyId/:roomId", Component: RoomDetail, },
      { path: "community", Component: CommunityPage },
      { path: "community/:postId/join-requests", Component: MemberRequestPage },
      { path: "message", Component: ConversationList },
    ]
  },

  {
    path: "/owner",
    Component: OwnerLayout,
    children: [
      { index: true, element: <Navigate to="properties" replace /> },
      { path: "property", element: <Navigate to="/owner/properties" replace /> },
      { path: "properties", Component: OwnerPropertiesPage },
      { path: "properties/new", Component: OwnerCreatePropertyPage },
      { path: "properties/:propertyId", Component: OwnerPropertyDetailPage },
      { path: "properties/:propertyId/edit", Component: OwnerPropertyDetailPage },
      { path: "properties/:propertyId/rooms/new", Component: CreateRoomDetail },
      { path: "properties/:propertyId/rooms/:roomId/edit", Component: OwnerEditRoomPage },
      { path: "rooms", Component: OwnerRoomsPage },
      { path: "rentals", Component: OwnerRentalsPage },
      { path: "rental-requests", Component: OwnerRentalRequestsPage },
      { path: "messages", Component: ConversationList },
      { path: "profile", Component: OwnerProfilePage },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const authMode = !token || !user ? "GUEST" : user.role;
  const finalRouter = useMemo(() => {
    if (authMode === "ADMIN") return createAdminRouter();
    if (authMode === "OWNER") return createOwnerRouter();
    if (authMode === "USER") return createUserRouter();
    return createGuestRouter();
  }, [authMode]);

  return <RouterProvider key={authMode} router={finalRouter} />;
};

export default AppRouter;
