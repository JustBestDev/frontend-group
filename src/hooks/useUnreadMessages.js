import { useEffect, useState } from "react";
import api from "../services/api.js";
import { createSocketClient, SOCKET_EVENTS } from "../services/socket.js";

export default function useUnreadMessages(token, userId) {
  const [unread, setUnread] = useState({ token: null, userId: null, count: 0 });

  useEffect(() => {
    if (!token || !userId) return undefined;

    let active = true;
    let requestVersion = 0;
    const refresh = async () => {
      const version = ++requestVersion;
      try {
        const response = await api.get("/conversations/unread-count");
        if (active && version === requestVersion) {
          setUnread({
            token,
            userId,
            count: Math.max(0, Number(response.data?.data?.count) || 0),
          });
        }
      } catch {
        // Keep the last known count when the server is temporarily unavailable.
      }
    };

    const socket = createSocketClient(token);
    const handleNewMessage = ({ message } = {}) => {
      if (String(message?.senderId) !== String(userId)) void refresh();
    };
    socket.on("connect", refresh);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGES_READ, refresh);
    socket.connect();
    void refresh();

    const intervalId = window.setInterval(refresh, 10000);
    window.addEventListener("notifications:refresh", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("notifications:refresh", refresh);
      window.removeEventListener("focus", refresh);
      socket.off("connect", refresh);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGES_READ, refresh);
      socket.disconnect();
    };
  }, [token, userId]);

  return token && userId && unread.token === token && unread.userId === userId
    ? unread.count
    : 0;
}
