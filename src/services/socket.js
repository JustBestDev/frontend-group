import { io } from "socket.io-client";

export const SOCKET_EVENTS = {
  JOIN_CONVERSATION: "conversation:join",
  LEAVE_CONVERSATION: "conversation:leave",
  NEW_MESSAGE: "message:new",
};

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && /^https?:\/\//i.test(apiUrl)) {
    return new URL(apiUrl).origin;
  }

  return window.location.origin;
};

export const createSocketClient = (token) =>
  io(getSocketUrl(), {
    auth: { token },
    autoConnect: false,
    transports: ["websocket", "polling"],
  });
