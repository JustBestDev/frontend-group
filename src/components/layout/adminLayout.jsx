import { NavLink, Outlet } from "react-router-dom";
import {
  Building2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
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

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1>RoomShare</h1>
            <span>Admin panel</span>
          </div>
        </div>

        <nav className="admin-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? "admin-nav-link active"
                    : "admin-nav-link"
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;