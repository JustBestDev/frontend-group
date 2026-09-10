import {
  BedDouble,
  Building2,
  ClipboardList,
  LogOut,
  MessageCircle,
  ReceiptText,
  UserRound,
  House,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import useAuthStore from "../stores/authStore.js";
import useRoleNotifications from "../hooks/useRoleNotifications.js";

import roomHubWordmark from "../assets/roomhub-wordmark.svg";
import roomHubAppIcon from "../assets/roomhub-app-icon.svg";

const OwnerLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const notificationCounts = useRoleNotifications("owner", token, user?.id || user?.userId);
  const menuItems = [
    { name: "Homepage", path: "/", icon: House, end: true },
    { name: "My Properties", path: "/owner/properties", icon: Building2 },
    { name: "Rooms", path: "/owner/rooms", icon: BedDouble },
    { name: "Rentals", path: "/owner/rentals", icon: ReceiptText },
    { name: "Rental Requests", path: "/owner/rental-requests", icon: ClipboardList },
    { name: "Messages", path: "/owner/messages", icon: MessageCircle },
    { name: "Profile", path: "/owner/profile", icon: UserRound },
  ];

  const handleLogout = () => {
    logout();
    navigate("/properties");
  };

  return (
    <div className="min-h-screen bg-cream md:flex">
      <aside className="z-10 flex w-full flex-col bg-linear-to-b from-[#244b3c] to-forest px-4 py-4 text-white shadow-[10px_0_30px_rgba(27,57,46,.12)] md:fixed md:inset-y-0 md:left-0 md:w-63.75 md:px-4.5 md:py-7">
        <div className="flex items-center gap-2 border-b border-white/20 px-2 pb-4 md:pb-7">
          <span className="grid size-11 place-items-center">
            <img
              src={roomHubAppIcon}
              alt="roomHubAppIcon"
              className="h-10 w-auto"
            />
          </span>
          <div>
            <img
              src={roomHubWordmark}
              alt="roomHubWordmark"
              className="block h-5 w-auto"
            />
            <span className="mt-0.5 block text-[10px] uppercase tracking-[.15em] text-white/65">
              Owner portal
            </span>
          </div>
        </div>

        <nav className="grid flex-1 grid-cols-3 gap-2 pt-4 md:flex md:flex-col md:pt-7" aria-label="Owner navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const notificationCount = item.name === "Rental Requests"
              ? notificationCounts.rentalRequests
              : item.name === "Messages" ? notificationCounts.messages : 0;
            const isMessageItem = item.name === "Messages";
            return (
              <NavLink key={item.path} to={item.path} end={item.end}
                aria-label={item.name}
                title={item.name}
                className={({ isActive }) => `relative flex items-center justify-center gap-3 rounded-xl px-2 py-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white md:justify-start md:px-4 ${isActive ? "bg-white/20 text-white before:absolute before:-left-4.5 before:inset-y-2 before:w-1 before:rounded-r before:bg-terracotta" : "text-white/75"}`}>
                <Icon size={20} aria-hidden="true" /><span className="hidden md:inline">{item.name}</span>
                {notificationCount > 0 && (isMessageItem
                  ? <span className="absolute right-2 top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white shadow-[0_0_0_3px_rgba(239,68,68,.12)] md:static md:ml-auto" title={`${notificationCount} unread messages`} aria-label={`${notificationCount} unread messages`}>{notificationCount > 99 ? "99+" : notificationCount}</span>
                  : <span className="absolute right-2 top-2 size-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,.12)] md:static md:ml-auto" title={`${notificationCount} unread`} aria-label={`${notificationCount} unread`} />)}
              </NavLink>
            );
          })}
        </nav>

        <button type="button" className="mt-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-transparent px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-white md:justify-start" onClick={handleLogout}>
          <LogOut size={20} aria-hidden="true" /><span>Log out</span>
        </button>
      </aside>

      <main className="min-h-screen w-full px-4.5 py-6 md:ml-63.75 md:w-[calc(100%-255px)] md:px-9.5 md:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
