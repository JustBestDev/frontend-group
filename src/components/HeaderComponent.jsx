import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Building2 } from "lucide-react";
import AuthModal from "./auth/AuthModal.jsx";
import OwnerApplicationModal from "./ownerApplication/OwnerApplicationModal.jsx";
import useAuthStore from "../stores/authStore.js";
import { getMyOwnerApplication } from "../services/ownerApplicationService.js";
import UserAvatar from "./UserAvatar.jsx";
import EditProfileModal from "./profile/EditProfileModal.jsx";

const HeaderComponent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOwnerApplicationModalOpen, setIsOwnerApplicationModalOpen] =
    useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [ownerApplication, setOwnerApplication] = useState(null);
  const [applicationState, setApplicationState] = useState("idle");
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = Boolean(token && currentUser);

  const loadOwnerApplication = useCallback(async () => {
    if (!isAuthenticated || currentUser?.role !== "USER") return;
    setApplicationState("loading");
    try {
      const application = await getMyOwnerApplication();
      setOwnerApplication(application);
      setApplicationState(application ? "ready" : "none");
    } catch {
      setOwnerApplication(null);
      setApplicationState("error");
    }
  }, [isAuthenticated, currentUser?.role]);

  useEffect(() => {
    // Loading the authenticated user's server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    loadOwnerApplication();
  }, [loadOwnerApplication]);

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
      <header className="sticky top-0 z-20 grid min-h-18 grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-surface/95 px-5 backdrop-blur md:px-12">
        <Link
          className="flex items-center gap-3 justify-self-start font-serif text-xl font-bold text-ink"
          to="/properties"
        >
          <div className="grid size-10 place-items-center rounded-xl bg-sage-dark text-white">
            <Building2 size={24} aria-hidden="true" />
          </div>

          <span>RoomShare</span>
        </Link>

        <nav
          className="flex items-center gap-8 justify-self-center"
          aria-label="Main navigation"
        >
          <Link
            className="font-semibold text-ink transition hover:text-terracotta"
            to="/properties"
          >
            Home
          </Link>

          <Link
            className="font-semibold text-ink transition hover:text-terracotta"
            to="/community"
          >
            Community
          </Link>

          <Link
            className="font-semibold text-ink transition hover:text-terracotta"
            to="/message"
          >
            Message
          </Link>
        </nav>

        <nav
          className="flex items-center gap-3 justify-self-end md:gap-6"
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
              className="public-login-button"
              onClick={() => setIsOwnerApplicationModalOpen(true)}
            >
              List a property
            </button>
          )}

          {currentUser?.role === "USER" &&
            applicationState === "ready" &&
            ownerApplication?.status === "APPROVED" && (
              <Link className="public-login-button" to="/owner">
                Owner Portal
              </Link>
            )}

          {currentUser?.role === "USER" &&
            applicationState === "ready" &&
            ownerApplication?.status !== "APPROVED" && (
              <button
                type="button"
                className={`owner-application-header-status status-${ownerApplication.status
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
              className="owner-application-header-error"
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
