import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";

const UserAvatar = ({ user, onLogout, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState("");
  const containerRef = useRef(null);
  const profileImageUrl =
    user?.profile?.profileImageUrl || user?.profileImageUrl;
  const showImage = profileImageUrl && failedImageUrl !== profileImageUrl;
  const fallbackInitial = user?.email?.trim().charAt(0).toUpperCase() || "?";
  const hasOwnerRoutes = user?.role === "OWNER";

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="user-avatar-menu" ref={containerRef}>
      <button
        type="button"
        className="user-avatar-trigger"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {showImage ? (
          <img
            src={profileImageUrl}
            alt=""
            className="user-avatar-image"
            onError={() => setFailedImageUrl(profileImageUrl)}
          />
        ) : (
          <span className="user-avatar-fallback" aria-hidden="true">
            {fallbackInitial}
          </span>
        )}
        <span className="user-avatar-indicator" aria-hidden="true">
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>

      {isOpen && (
        <div className="user-avatar-dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onEditProfile();
            }}
          >
            <UserRound size={17} aria-hidden="true" />
            Edit profile
          </button>
          {hasOwnerRoutes && (
            <>
              <Link
                to="/owner"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={17} aria-hidden="true" />
                Owner Portal
              </Link>
            </>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            <LogOut size={17} aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
