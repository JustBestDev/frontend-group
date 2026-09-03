import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Building2, LogOut } from "lucide-react";
import AuthModal from "./auth/AuthModal.jsx";
import useAuthStore from "../stores/authStore.js";

const HeaderComponent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = Boolean(token && currentUser);

  const handleLogout = () => {
    logout();
    navigate("/properties");
  };

  return (
    <>
      <header className="public-header">
        <Link className="public-brand" to="/properties">
          <div className="public-brand-icon">
            <Building2 size={24} aria-hidden="true" />
          </div>

          <span>RoomShare</span>
        </Link>

        <nav
          className="public-navigation"
          aria-label="Main navigation"
        >
          <Link to="/properties">Rent</Link>

          {currentUser?.role === "ADMIN" && (
            <Link to="/admin">Admin panel</Link>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              className="public-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} aria-hidden="true" />
              <span>Log out</span>
            </button>
          ) : (
            <button
              type="button"
              className="public-login-button"
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
    </>
  );
};

export default HeaderComponent;
