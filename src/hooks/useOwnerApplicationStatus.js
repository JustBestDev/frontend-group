import { useCallback, useEffect, useState } from "react";
import { getMyOwnerApplication } from "../services/ownerApplicationService.js";

export default function useOwnerApplicationStatus(isAuthenticated, role) {
  const [ownerApplication, setOwnerApplication] = useState(null);
  const [applicationState, setApplicationState] = useState("idle");

  const loadOwnerApplication = useCallback(async () => {
    if (!isAuthenticated || role !== "USER") return;
    setApplicationState("loading");
    try {
      const application = await getMyOwnerApplication();
      setOwnerApplication(application);
      setApplicationState(application ? "ready" : "none");
    } catch {
      setOwnerApplication(null);
      setApplicationState("error");
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    // Loading the authenticated user's server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    loadOwnerApplication();
  }, [loadOwnerApplication]);

  return {
    ownerApplication,
    applicationState,
    loadOwnerApplication,
  };
}
