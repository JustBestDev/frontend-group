import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Building2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

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

  return (
    <div className="min-h-screen bg-[#f4f7f4] md:flex">
      <aside className="z-10 flex w-full flex-col bg-[#263d50] p-4 text-white md:fixed md:inset-y-0 md:left-0 md:w-65 md:p-6">
        <div className="flex items-center gap-3 border-b border-white/15 pb-5">
          <div className="grid size-11 place-items-center rounded-xl bg-white text-[#263d50]">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="font-serif text-xl font-bold">RoomShare</h1>
            <span className="text-[10px] uppercase tracking-[.15em] text-white/60">Admin panel</span>
          </div>
        </div>

        <nav className="grid flex-1 gap-2 pt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#263d50]"
                    : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
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
          className="mt-4 flex items-center gap-3 rounded-xl bg-transparent px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="min-h-screen w-full p-5 md:ml-65 md:w-[calc(100%-260px)] md:p-9">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
