import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Building2 } from "lucide-react";
import AuthModal from "./auth/AuthModal.jsx";
import OwnerApplicationModal from "./ownerApplication/OwnerApplicationModal.jsx";
import useAuthStore from "../stores/authStore.js";
import { getMyOwnerApplication } from "../services/ownerApplicationService.js";
import UserAvatar from "./UserAvatar.jsx";

const HeaderComponent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);
  const [isOwnerApplicationModalOpen, setIsOwnerApplicationModalOpen] =
    useState(false);
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

          {currentUser?.role === "USER" && applicationState === "loading" && (
            <span className="owner-application-header-placeholder" aria-label="Loading owner application status" />
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

          {currentUser?.role === "USER" && applicationState === "ready" && ownerApplication?.status === "APPROVED" && (
            <Link className="public-login-button" to="/owner">Owner Portal</Link>
          )}

          {currentUser?.role === "USER" && applicationState === "ready" && ownerApplication?.status !== "APPROVED" && (
            <button type="button" className={`owner-application-header-status status-${ownerApplication.status.toLowerCase().replaceAll("_", "-")}`} onClick={() => setIsOwnerApplicationModalOpen(true)}>
              Owner application · {ownerApplication.status === "PENDING" ? "Under review" : ownerApplication.status === "NEED_MORE_DOCUMENTS" ? "Action required" : "Rejected"}
            </button>
          )}

          {currentUser?.role === "USER" && applicationState === "error" && (
            <button type="button" className="owner-application-header-error" onClick={loadOwnerApplication}>Application status unavailable · Retry</button>
          )}

          {isAuthenticated ? (
            <UserAvatar user={currentUser} onLogout={handleLogout} />
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

      <OwnerApplicationModal
        isOpen={isOwnerApplicationModalOpen}
        onClose={() => setIsOwnerApplicationModalOpen(false)}
        application={ownerApplication}
        onSubmitted={loadOwnerApplication}
      />
    </>
  );
};

export default HeaderComponent;
