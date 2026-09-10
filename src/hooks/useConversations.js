import { useEffect, useRef, useState } from "react";
import api from "../services/api.js";
import { createSocketClient, SOCKET_EVENTS } from "../services/socket.js";
import useAuthStore from "../stores/authStore.js";
import { sortMessagesOldestFirst, getCreatedMessage, getConversationId, getSocketMessage } from "../utils/conversations.js";

export default function useConversations(requestedConversationId) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [startingSupport, setStartingSupport] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const openedConversationIdRef = useRef(null);

  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const contactAdmin = async () => {
    setStartingSupport(true);
    setError("");
    try {
      const response = await api.post("/conversations/support");
      const conversation = response.data.conversation || response.data.data?.conversation;
      if (conversation) {
        setConversations((current) => {
          const exists = current.some((item) => String(getConversationId(item)) === String(getConversationId(conversation)));
          return exists ? current : [conversation, ...current];
        });
        await openConversation(conversation);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to contact admin");
    } finally {
      setStartingSupport(false);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/conversations");

      const conversationData =
        response.data.data?.conversations ||
        response.data.data ||
        response.data.conversations ||
        [];

      setConversations(Array.isArray(conversationData) ? conversationData : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to retrieve conversations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = createSocketClient(token);
    socketRef.current = socket;

    const handleConnect = () => {
      const conversationId = getConversationId(selectedConversationRef.current);
      if (conversationId) {
        socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });

        api
          .get(`/conversations/${conversationId}/messages`)
          .then((response) => {
            if (
              String(getConversationId(selectedConversationRef.current)) !==
              String(conversationId)
            ) {
              return;
            }

            const messageData =
              response.data.data?.messages ||
              response.data.data ||
              response.data.messages ||
              [];

            if (Array.isArray(messageData)) {
              setMessages(sortMessagesOldestFirst(messageData));
            }
          })
          .catch(() => { });
      }
    };

    const handleNewMessage = (payload) => {
      const socketMessage = getSocketMessage(payload);
      if (!socketMessage?.conversationId) return;

      const { conversationId, message } = socketMessage;
      const selectedId = getConversationId(selectedConversationRef.current);
      const isSelected = String(selectedId) === String(conversationId);

      if (isSelected) {
        setMessages((currentMessages) => {
          const alreadyExists = currentMessages.some(
            (item) =>
              item.id && message.id && String(item.id) === String(message.id),
          );
          return alreadyExists
            ? currentMessages
            : sortMessagesOldestFirst([...currentMessages, message]);
        });

        api.patch(`/conversations/${conversationId}/read`).catch(() => { });
      }

      setConversations((currentConversations) => {
        const itemIndex = currentConversations.findIndex(
          (item) => String(getConversationId(item)) === String(conversationId),
        );
        if (itemIndex < 0) return currentConversations;

        const conversation = currentConversations[itemIndex];
        const updatedConversation = {
          ...conversation,
          lastMessage: message,
          messages: [message],
          unreadCount: isSelected ? 0 : (conversation.unreadCount || 0) + 1,
        };

        return [
          updatedConversation,
          ...currentConversations.filter((_, index) => index !== itemIndex),
        ];
      });
    };

    const handleMessagesRead = ({ conversationId, readerId }) => {
      const selectedId = getConversationId(selectedConversationRef.current);
      if (String(selectedId) !== String(conversationId)) return;

      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          const senderId = message.senderId || message.sender?.id;
          return String(senderId) !== String(readerId)
            ? { ...message, isRead: true }
            : message;
        }),
      );
    };

    socket.on("connect", handleConnect);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const conversationId = getConversationId(selectedConversation);
    const socket = socketRef.current;
    if (!conversationId || !socket) return undefined;

    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
    };
  }, [selectedConversation]);

  const openConversation = async (conversation) => {
    const conversationId = conversation.id || conversation.conversationId;

    selectedConversationRef.current = conversation;
    setSelectedConversation(conversation);
    setMessageLoading(true);
    setMessages([]);
    setError("");

    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`,
      );

      if (String(getConversationId(selectedConversationRef.current)) !== String(conversationId)) return;

      const messageData =
        response.data.data?.messages ||
        response.data.data ||
        response.data.messages ||
        [];

      setMessages(
        Array.isArray(messageData) ? sortMessagesOldestFirst(messageData) : [],
      );

      await api.patch(`/conversations/${conversationId}/read`);
      window.dispatchEvent(new Event("owner-notifications:refresh"));
      window.dispatchEvent(new Event("notifications:refresh"));

      setConversations((currentConversations) =>
        currentConversations.map((item) => {
          const itemId = item.id || item.conversationId;

          return itemId === conversationId ? { ...item, unreadCount: 0 } : item;
        }),
      );
    } catch (requestError) {
      if (String(getConversationId(selectedConversationRef.current)) !== String(conversationId)) return;
      setError(
        requestError.response?.data?.message || "Unable to retrieve messages",
      );
    } finally {
      if (String(getConversationId(selectedConversationRef.current)) === String(conversationId)) {
        setMessageLoading(false);
      }
    }
  };

  useEffect(() => {
    const requestedId = requestedConversationId;
    if (!requestedId || openedConversationIdRef.current === String(requestedId)) return;

    const requestedConversation = conversations.find(
      (conversation) => String(getConversationId(conversation)) === String(requestedId),
    );
    if (!requestedConversation) return;

    openedConversationIdRef.current = String(requestedId);
    openConversation(requestedConversation);
    // Open only the conversation explicitly passed by the property page.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, requestedConversationId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = newMessage.trim();

    if (!content || !selectedConversation) return;

    const conversationId =
      selectedConversation.id || selectedConversation.conversationId;

    setSending(true);
    setError("");

    try {
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        { message: content },
      );

      const createdMessage = getCreatedMessage(response);

      if (createdMessage) {
        setMessages((currentMessages) => {
          const alreadyExists = currentMessages.some(
            (message) =>
              message.id &&
              createdMessage.id &&
              String(message.id) === String(createdMessage.id),
          );

          return alreadyExists
            ? currentMessages
            : sortMessagesOldestFirst([...currentMessages, createdMessage]);
        });

        setConversations((currentConversations) => {
          const itemIndex = currentConversations.findIndex(
            (item) =>
              String(getConversationId(item)) === String(conversationId),
          );
          if (itemIndex < 0) return currentConversations;

          const updatedConversation = {
            ...currentConversations[itemIndex],
            lastMessage: createdMessage,
            messages: [createdMessage],
          };

          return [
            updatedConversation,
            ...currentConversations.filter((_, index) => index !== itemIndex),
          ];
        });
      } else {
        await openConversation(selectedConversation);
      }

      setNewMessage("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to send the message",
      );
    } finally {
      setSending(false);
    }
  };

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    newMessage,
    setNewMessage,
    loading,
    messageLoading,
    sending,
    startingSupport,
    error,
    contactAdmin,
    fetchConversations,
    openConversation,
    handleSendMessage,
    currentUser,
  };
}
