import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Building2, LogOut } from "lucide-react";
import AuthModal from "./auth/AuthModal.jsx";
import OwnerApplicationModal from "./ownerApplication/OwnerApplicationModal.jsx";
import useAuthStore from "../stores/authStore.js";

const HeaderComponent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);
  const [isOwnerApplicationModalOpen, setIsOwnerApplicationModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = Boolean(token && currentUser);

  useEffect(() => {
    const shouldOpen =
      sessionStorage.getItem("openOwnerApplicationModal") === "true";

    if (
      !isAuthenticated ||
      currentUser?.role !== "USER" ||
      !shouldOpen
    ) {
      return;
    }

    // The session flag is external state and must be consumed after auth updates.
    // oxlint-disable-next-line react/set-state-in-effect
    setIsOwnerApplicationModalOpen(true);
    sessionStorage.removeItem("openOwnerApplicationModal");
  }, [isAuthenticated, currentUser?.role]);

  const handleLogout = () => {
    logout();
    navigate("/properties");
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between border-b border-line bg-surface/95 px-5 backdrop-blur md:px-12">
        <Link className="flex items-center gap-3 font-serif text-xl font-bold text-ink" to="/properties">
          <div className="grid size-10 place-items-center rounded-xl bg-sage-dark text-white">
            <Building2 size={24} aria-hidden="true" />
          </div>

          <span>RoomShare</span>
        </Link>

        <nav
          className="flex items-center gap-3 md:gap-6"
          aria-label="Main navigation"
        >
          <Link className="font-semibold text-ink transition hover:text-terracotta" to="/properties">Rent</Link>

          {currentUser?.role === "ADMIN" && (
            <Link className="font-semibold text-ink transition hover:text-terracotta" to="/admin">Admin panel</Link>
          )}

          {currentUser?.role === "USER" && (
            <button
              type="button"
              className="public-login-button"
              onClick={() => setIsOwnerApplicationModalOpen(true)}
            >
              List a property
            </button>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-line bg-transparent px-4 py-2 font-semibold text-ink hover:bg-sage-light"
              onClick={handleLogout}
            >
              <LogOut size={17} aria-hidden="true" />
              <span>Log out</span>
            </button>
          ) : (
            <button
              type="button"
              className="rounded-xl bg-terracotta px-5 py-2.5 font-bold text-white transition hover:brightness-95"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Log in
            </button>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <OwnerApplicationModal
        isOpen={isOwnerApplicationModalOpen}
        onClose={() => setIsOwnerApplicationModalOpen(false)}
      />
    </>
  );
};

export default HeaderComponent;
