import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import AuthModal from "./auth/AuthModal.jsx";
import OwnerApplicationModal from "./ownerApplication/OwnerApplicationModal.jsx";
import useAuthStore from "../stores/authStore.js";
import useOwnerApplicationStatus from "../hooks/useOwnerApplicationStatus.js";
import UserAvatar from "./UserAvatar.jsx";
import EditProfileModal from "./profile/EditProfileModal.jsx";
import useUnreadMessages from "../hooks/useUnreadMessages.js";

import roomHubLogo from "../assets/roomhub-logo.svg";

const publicNavClass = ({ isActive }) =>
  `inline-flex min-h-11 items-center border-b-2 text-[13px] font-semibold transition sm:text-sm ${
    isActive
      ? "border-forest text-forest"
      : "border-transparent text-ink hover:border-sage hover:text-forest"
  }`;

const HeaderComponent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOwnerApplicationModalOpen, setIsOwnerApplicationModalOpen] =
    useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = Boolean(token && currentUser);
  const unreadMessageCount = useUnreadMessages(
    token,
    currentUser?.id || currentUser?.userId,
  );

  const { ownerApplication, applicationState, loadOwnerApplication } =
    useOwnerApplicationStatus(isAuthenticated, currentUser?.role);

  useEffect(() => {
    const shouldOpen =
      sessionStorage.getItem("openOwnerApplicationModal") === "true";

    if (
      !isAuthenticated ||
      currentUser?.role !== "USER" ||
      !["none", "ready"].includes(applicationState) ||
      !shouldOpen
    ) {
      return;
    }

    // The session flag is external state and must be consumed after auth updates.
    // oxlint-disable-next-line react/set-state-in-effect
    setIsOwnerApplicationModalOpen(true);
    sessionStorage.removeItem("openOwnerApplicationModal");
  }, [applicationState, isAuthenticated, currentUser?.role]);

  const handleLogout = () => {
    logout();
    navigate("/properties");
  };

  return (
    <>
      <header className="sticky top-0 z-20 grid grid-cols-[1fr_auto] items-center border-b border-[#e8e5dd] bg-[#fcfaf5]/96 px-4 py-2 backdrop-blur sm:min-h-18 sm:grid-cols-[1fr_auto_1fr] sm:px-6 sm:py-0 lg:px-12">
        <Link className="col-start-1 row-start-1 justify-self-start" to="/properties">
          <img
            src={roomHubLogo}
            alt="RoomHub"
            className="h-auto w-24 sm:w-32"
          />
        </Link>

        <nav
          className="col-span-2 row-start-2 flex min-w-0 items-center justify-center gap-5 justify-self-stretch sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:gap-8 sm:justify-self-center"
          aria-label="Main navigation"
        >
          <NavLink
            className={publicNavClass}
            to="/properties"
          >
            Find a place
          </NavLink>

          <NavLink
            className={publicNavClass}
            to="/community"
          >
            Community
          </NavLink>


          <NavLink
            className={({ isActive }) => `${publicNavClass({ isActive })} gap-2`}
            to="/message"
          >
            Message
            {unreadMessageCount > 0 && (
              <span
                className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white shadow-[0_0_0_3px_rgba(239,68,68,.12)]"
                title={`${unreadMessageCount} unread messages`}
                aria-label={`${unreadMessageCount} unread messages`}
              >
                {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
              </span>
            )}
          </NavLink>
        </nav>

        <nav
          className="col-start-2 row-start-1 flex min-w-0 items-center gap-2 justify-self-end sm:col-start-3 sm:gap-3 lg:gap-6"
          aria-label="Account navigation"
        >
          {currentUser?.role === "ADMIN" && (
            <Link
              className="font-semibold text-ink transition hover:text-terracotta"
              to="/admin"
            >
              Admin panel
            </Link>
          )}

          {currentUser?.role === "USER" && applicationState === "loading" && (
            <span
              className="owner-application-header-placeholder"
              aria-label="Loading owner application status"
            />
          )}

          {currentUser?.role === "USER" && applicationState === "none" && (
            <button
              type="button"
              className="public-login-button whitespace-nowrap !px-3 !py-2 text-xs sm:!px-4 sm:text-sm"
              onClick={() => setIsOwnerApplicationModalOpen(true)}
            >
              List a property
            </button>
          )}

          {currentUser?.role === "USER" &&
            applicationState === "ready" &&
            ownerApplication?.status === "APPROVED" && (
              <Link className="public-login-button whitespace-nowrap !px-3 !py-2 text-xs sm:!px-4 sm:text-sm" to="/owner">
                Owner Portal
              </Link>
            )}

          {currentUser?.role === "USER" &&
            applicationState === "ready" &&
            ownerApplication?.status !== "APPROVED" && (
              <button
                type="button"
                className={`owner-application-header-status max-w-35 truncate status-${ownerApplication.status
                  .toLowerCase()
                  .replaceAll("_", "-")}`}
                onClick={() => setIsOwnerApplicationModalOpen(true)}
              >
                Owner application ·{" "}
                {ownerApplication.status === "PENDING"
                  ? "Under review"
                  : ownerApplication.status === "NEED_MORE_DOCUMENTS"
                    ? "Action required"
                    : "Rejected"}
              </button>
            )}

          {currentUser?.role === "USER" && applicationState === "error" && (
            <button
              type="button"
              className="owner-application-header-error max-w-35 truncate"
              onClick={loadOwnerApplication}
            >
              Application status unavailable · Retry
            </button>
          )}

          {isAuthenticated ? (
            <UserAvatar
              user={currentUser}
              onLogout={handleLogout}
              onEditProfile={() => setIsEditProfileModalOpen(true)}
            />
          ) : (
            <button
              type="button"
              className="min-h-11 rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 sm:px-5"
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
        application={ownerApplication}
        onSubmitted={loadOwnerApplication}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      />
    </>
  );
};

export default HeaderComponent;
