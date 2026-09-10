import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import api from "../services/api.js";
import useUnreadMessages from "./useUnreadMessages.js";

const SETTINGS = {
  owner: { endpoint: "/rental-requests/owner/unread-count", event: "owner-notifications:refresh", interval: 10000 },
  admin: { endpoint: "/admin/notifications/unread-counts", event: "notifications:refresh", interval: 30000 },
};

export default function useRoleNotifications(role, token, userId) {
  const { pathname } = useLocation();
  const messages = useUnreadMessages(token, userId);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!token || !userId) return undefined;
    const settings = SETTINGS[role];
    let active = true;
    let version = 0;
    const refresh = async () => {
      const requestVersion = ++version;
      try {
        const response = await api.get(settings.endpoint);
        if (!active || requestVersion !== version) return;
        const data = response.data?.data;
        setSnapshot({
          token, userId, role,
          rentalRequests: Number(data?.count) || 0,
          ownerApplications: Number(data?.ownerApplications) || 0,
          properties: Number(data?.properties) || 0,
        });
      } catch {
        // Keep navigation usable when notifications are temporarily unavailable.
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, settings.interval);
    window.addEventListener(settings.event, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener(settings.event, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [role, token, userId, pathname]);

  const counts = snapshot?.token === token && snapshot?.userId === userId && snapshot?.role === role
    ? snapshot
    : { rentalRequests: 0, ownerApplications: 0, properties: 0 };
  return { rentalRequests: counts.rentalRequests, ownerApplications: counts.ownerApplications, properties: counts.properties, messages };
}
