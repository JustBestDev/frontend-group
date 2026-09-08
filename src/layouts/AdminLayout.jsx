import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell,
  Building2,
  ChevronDown,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  UsersRound,
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import api from "../services/api.js";
import { createSocketClient, SOCKET_EVENTS } from "../services/socket.js";

import roomHubWordmark from "../assets/roomhub-wordmark.svg";
import roomHubAppIcon from "../assets/roomhub-app-icon.svg";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [notificationCounts, setNotificationCounts] = useState({ ownerApplications: 0, properties: 0, messages: 0 });

  const handleLogout = () => {
    logout();
    navigate("/properties");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: UsersRound,
    },
    {
      name: "Owner Applications",
      path: "/admin/owner-applications",
      icon: FileCheck2,
    },
    {
      name: "Property Approvals",
      path: "/admin/properties",
      icon: Building2,
    },
    {
      name: "Conversations",
      path: "/admin/conversations",
      icon: MessageCircle,
    },
  ];

  const refreshNotifications = useCallback(async () => {
    try {
      const [adminResponse, messageResponse] = await Promise.all([
        api.get("/admin/notifications/unread-counts"),
        api.get("/conversations/unread-count"),
      ]);
      setNotificationCounts({
        ownerApplications: Number(adminResponse.data?.data?.ownerApplications) || 0,
        properties: Number(adminResponse.data?.data?.properties) || 0,
        messages: Number(messageResponse.data?.data?.count) || 0,
      });
    } catch {
      // Notification failures should not prevent admin navigation.
    }
  }, []);

  useEffect(() => {
    // Notification totals are server state and should follow route changes.
    // oxlint-disable-next-line react/set-state-in-effect
    refreshNotifications();
  }, [location.pathname, refreshNotifications]);

  useEffect(() => {
    const intervalId = window.setInterval(refreshNotifications, 30000);
    const handleRefresh = () => refreshNotifications();
    window.addEventListener("notifications:refresh", handleRefresh);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("notifications:refresh", handleRefresh);
    };
  }, [refreshNotifications]);

  useEffect(() => {
    if (!token) return undefined;
    const socket = createSocketClient(token);
    const handleNewMessage = ({ message }) => {
      if (String(message?.senderId) !== String(user?.id || user?.userId)) refreshNotifications();
    };
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGES_READ, refreshNotifications);
    socket.connect();
    return () => socket.disconnect();
  }, [refreshNotifications, token, user?.id, user?.userId]);

  const totalNotifications = notificationCounts.ownerApplications + notificationCounts.properties + notificationCounts.messages;

  return (
    <div className="min-h-screen bg-[#F5F6F4]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#E4E9E4] bg-white lg:flex">
        {/* Brand */}
        <div className="flex h-20 items-center border-b border-[#E8ECE8] px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#17382E]">
              <img
                src={roomHubAppIcon}
                alt="RoomHub"
                className="h-7 w-auto"
              />
            </div>

            <div>
              <img
                src={roomHubWordmark}
                alt="RoomHub"
                className="h-5 w-auto"
              />

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#829087]">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9AA39D]">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const notificationCount = item.name === "Owner Applications"
              ? notificationCounts.ownerApplications
              : item.name === "Property Approvals"
                ? notificationCounts.properties
                : item.name === "Conversations" ? notificationCounts.messages : 0;
            const isMessageItem = item.name === "Conversations";

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#EAF0EC] text-[#17382E]"
                      : "text-[#6B756F] hover:bg-[#F5F7F5] hover:text-[#17382E]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "grid size-9 place-items-center rounded-lg transition",
                        isActive
                          ? "bg-[#17382E] text-white"
                          : "text-[#76827B] group-hover:bg-white group-hover:text-[#17382E]",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={1.9} />
                    </span>

                    <span>{item.name}</span>
                    {notificationCount > 0 && (isMessageItem
                      ? <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white shadow-[0_0_0_3px_rgba(239,68,68,.12)]" title={`${notificationCount} unread messages`} aria-label={`${notificationCount} unread messages`}>{notificationCount > 99 ? "99+" : notificationCount}</span>
                      : <span className="ml-auto size-2 rounded-full bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,.12)]" title={`${notificationCount} unread`} aria-label={`${notificationCount} unread`} />)}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#E8ECE8] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#7D8680] transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="grid size-9 place-items-center">
              <LogOut size={18} />
            </span>

            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-h-screen lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-20 items-center border-b border-[#E4E9E4] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between gap-4">
            {/* Left */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {/* Mobile menu visual placeholder */}
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#E5EAE6] text-[#536159] transition hover:bg-[#F5F7F5] lg:hidden"
              >
                <Menu size={20} />
              </button>

              {/* Search */}
              <div className="relative hidden w-full max-w-md sm:block">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA39D]"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className="h-11 w-full rounded-xl border border-[#E5EAE6] bg-[#F8FAF8] pl-11 pr-4 text-sm text-[#26352D] outline-none transition placeholder:text-[#A0AAA4] focus:border-[#A9BBA3] focus:bg-white focus:ring-4 focus:ring-[#A9BBA3]/15"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative grid size-10 place-items-center rounded-xl text-[#657169] transition hover:bg-[#F4F7F4] hover:text-[#17382E]"
              >
                <Bell size={19} />

                {totalNotifications > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#D97757] ring-2 ring-white" title={`${totalNotifications} unread notifications`} />}
              </button>

              <div className="mx-1 hidden h-8 w-px bg-[#E5EAE6] sm:block" />

              {/* Admin profile */}
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-[#F4F7F4]"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#17382E] text-sm font-semibold text-white">
                  {user?.username?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-[#24342C]">
                    {user?.username || "Administrator"}
                  </p>

                  <p className="text-[11px] font-medium text-[#8B968F]">
                    Administrator
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="hidden text-[#8B968F] md:block"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
