import {
  BedDouble,
  Building2,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import useAuthStore from "../stores/authStore.js";

const OwnerLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const menuItems = [
    { name: "Overview", path: "/owner", icon: LayoutDashboard, end: true },
    { name: "My Properties", path: "/owner/properties", icon: Building2 },
    { name: "Rooms", path: "/owner/rooms", icon: BedDouble },
    { name: "Rentals", path: "/owner/rentals", icon: ReceiptText },
    { name: "Messages", path: "/owner/messages", icon: MessageCircle },
    { name: "Profile", path: "/owner/profile", icon: UserRound },
  ];

  const handleLogout = () => {
    logout();
    navigate("/properties");
  };

  return (
    <div className="min-h-screen bg-cream md:flex">
      <aside className="z-10 flex w-full flex-col bg-gradient-to-b from-[#244b3c] to-forest px-4 py-4 text-white shadow-[10px_0_30px_rgba(27,57,46,.12)] md:fixed md:inset-y-0 md:left-0 md:w-[255px] md:px-[18px] md:py-7">
        <div className="flex items-center gap-3 border-b border-white/20 px-2 pb-4 md:pb-7">
          <span className="grid size-11 place-items-center rounded-[14px] bg-white text-sage-dark"><ShieldCheck size={25} /></span>
          <div><strong className="block font-serif text-[21px]">RoomShare</strong><span className="mt-0.5 block text-[10px] uppercase tracking-[.15em] text-white/65">Owner portal</span></div>
        </div>

        <nav className="grid flex-1 grid-cols-3 gap-2 pt-4 md:flex md:flex-col md:pt-7" aria-label="Owner navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.end}
                aria-label={item.name}
                title={item.name}
                className={({ isActive }) => `relative flex items-center justify-center gap-3 rounded-xl px-2 py-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white md:justify-start md:px-4 ${isActive ? "bg-white/20 text-white before:absolute before:-left-[18px] before:inset-y-2 before:w-1 before:rounded-r before:bg-terracotta" : "text-white/75"}`}>
                <Icon size={20} aria-hidden="true" /><span className="hidden md:inline">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button type="button" className="mt-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-transparent px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-white md:justify-start" onClick={handleLogout}>
          <LogOut size={20} aria-hidden="true" /><span>Log out</span>
        </button>
      </aside>

      <main className="min-h-screen w-full px-[18px] py-6 md:ml-[255px] md:w-[calc(100%-255px)] md:px-[38px] md:py-8"><Outlet /></main>
    </div>
  );
};

export default OwnerLayout;
