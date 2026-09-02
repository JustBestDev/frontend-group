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
import { NavLink, Outlet } from "react-router";

const OwnerLayout = () => {
  const menuItems = [
    { name: "Overview", path: "/owner", icon: LayoutDashboard, end: true },
    { name: "My Properties", path: "/owner/properties", icon: Building2 },
    { name: "Rooms", path: "/owner/rooms", icon: BedDouble },
    { name: "Rentals", path: "/owner/rentals", icon: ReceiptText },
    { name: "Messages", path: "/owner/messages", icon: MessageCircle },
    { name: "Profile", path: "/owner/profile", icon: UserRound },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="owner-shell">
      <aside className="owner-sidebar">
        <div className="owner-brand">
          <span className="owner-brand-icon"><ShieldCheck size={25} /></span>
          <div><strong>RoomShare</strong><span>Owner portal</span></div>
        </div>

        <nav className="owner-navigation" aria-label="Owner navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.end}
                className={({ isActive }) => isActive ? "owner-nav-link active" : "owner-nav-link"}>
                <Icon size={20} /><span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button type="button" className="owner-logout" onClick={handleLogout}>
          <LogOut size={20} /><span>Log out</span>
        </button>
      </aside>

      <main className="owner-main"><Outlet /></main>
    </div>
  );
};

export default OwnerLayout;
