import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  Send,
  Check,
  CheckCheck,
  Headphones,
} from "lucide-react";
import useConversations from "../../hooks/useConversations.js";
import UserProfileModal from "../../components/profile/UserProfileModal.jsx";
import SharedListingCard from "../../components/conversations/SharedListingCard.jsx";
import { getMessagePreview, isSharedListingMessage } from "../../utils/conversations.js";
import { useLocation } from "react-router";

const ConversationList = () => {
  const location = useLocation();
  const isOwnerView = location.pathname.startsWith("/owner");
  const isPortalView = isOwnerView || location.pathname.startsWith("/admin");
  const {
    conversations, selectedConversation, setSelectedConversation, messages,
    newMessage, setNewMessage, loading, messageLoading, sending,
    startingSupport, error, contactAdmin, fetchConversations,
    openConversation, handleSendMessage, currentUser,
  } = useConversations(location.state?.conversationId);
  const [profileUserId, setProfileUserId] = useState(null);
  const closeUserProfile = useCallback(() => setProfileUserId(null), []);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messageLoading || messages.length === 0) return;

    const frameId = requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [messageLoading, messages]);

  const getConversationUser = (conversation) => {
    if (!conversation) return {};

    return (
      conversation.members?.find(
        (member) =>
          member.user?.id !== (currentUser?.id || currentUser?.userId),
      )?.user ||
      conversation.otherUser ||
      conversation.participant ||
      conversation.user ||
      conversation.owner ||
      {}
    );
  };

  const getUserName = (conversation) => {
    const user = getConversationUser(conversation);

    return (
      user.profile?.displayName ||
      [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") ||
      user.username ||
      user.email ||
      conversation?.title ||
      "Conversation"
    );
  };

  const getUserHandle = (conversation) => {
    const user = getConversationUser(conversation);
    return user.username ? `@${user.username}` : "";
  };

  const isMyMessage = (message) => {
    const senderId = message.senderId || message.sender?.id;

    const currentUserId = currentUser?.id || currentUser?.userId;

    return Boolean(currentUserId && senderId === currentUserId);
  };

  if (loading) {
    return (
      <div className="grid min-h-64 place-items-center text-muted-copy">
        Loading conversations...
      </div>
    );
  }

  const otherUser = getConversationUser(selectedConversation);
  const otherUserName = getUserName(selectedConversation);

  return (
    <>
      <section className={`mx-auto flex h-[calc(100dvh-40px)] min-h-0 w-full max-w-330 flex-col overflow-hidden md:h-[calc(100dvh-72px)] ${isPortalView ? "" : "px-4 py-5 sm:px-6 md:py-8"}`}>
        <div className="mb-5 flex shrink-0 items-end justify-between gap-5 max-sm:flex-col max-sm:items-stretch md:mb-7">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-sage-dark">
              {isOwnerView ? "Inbox" : "Messages"}
            </p>
            <h1 className="m-0 font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-forest md:text-[40px]">
              {isOwnerView ? "Messages" : "Your conversations"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-copy sm:text-base">
              Stay in touch with hosts, roommates, and RoomHub support.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isOwnerView && <button type="button" disabled={startingSupport} onClick={contactAdmin} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#244b3c] disabled:opacity-50"><Headphones size={17} />{startingSupport ? "Opening..." : "Contact admin"}</button>}
            <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dcded4] bg-surface px-4 py-2.5 text-sm font-bold text-forest transition hover:border-sage hover:bg-sage-light/50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark" onClick={fetchConversations}>
              <RefreshCw size={17} /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <p
            className="mb-4 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[350px_minmax(0,1fr)] overflow-hidden rounded-3xl border border-[#dedfd5] bg-surface shadow-[0_16px_45px_rgba(49,66,54,0.08)] max-[850px]:block">
          <aside
            className={`h-full min-h-0 overflow-y-auto border-r border-[#e2e3d9] bg-[#fffefa] overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden max-[850px]:w-full max-[850px]:border-r-0 ${selectedConversation ? "max-[850px]:hidden" : ""}`}
          >
            <div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-[#e6e5dc] bg-[#fffefa]/95 px-5 py-4.5 backdrop-blur">
              <h2 className="m-0 font-serif text-[22px] font-bold text-forest">Inbox</h2>
              <span className="rounded-full bg-sage-light px-2.5 py-1 text-[11px] font-bold leading-none text-sage-dark">
                {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
              </span>
            </div>

            {conversations.length === 0 ? (
              <div className="grid h-full place-content-center justify-items-center p-8 text-center text-muted-copy">
                <MessageCircle size={38} />
                <h3 className="mb-1 mt-3 font-bold text-ink">No conversations</h3>
                <p className="m-0">Your conversations will appear here.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {conversations.map((conversation) => {
                  const conversationUser = getConversationUser(conversation);
                  const conversationImageUrl =
                    conversationUser?.profile?.profileImageUrl ||
                    conversationUser?.profileImageUrl;
                  const conversationId =
                    conversation.id || conversation.conversationId;

                  const selectedId =
                    selectedConversation?.id ||
                    selectedConversation?.conversationId;

                  const lastMessage =
                    conversation.lastMessage || conversation.messages?.[0];

                  return (
                    <button
                      type="button"
                      key={conversationId}
                      className={`relative flex w-full cursor-pointer items-center gap-3.5 border-0 border-b border-[#ecebe3] px-4.5 py-4.5 text-left transition before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r-full hover:bg-sage-light/45 ${selectedId === conversationId ? "bg-sage-light/75 before:bg-forest" : "bg-transparent before:bg-transparent"}`}
                      onClick={() => openConversation(conversation)}
                    >
                      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-forest font-serif text-base font-bold text-white ring-1 ring-forest/10">
                        {conversationImageUrl ? (
                          <img
                            src={conversationImageUrl}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          getUserName(conversation).charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-forest">
                            {getUserName(conversation)}
                          </strong>

                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-forest px-1.5 py-0.5 text-center text-[10px] font-extrabold leading-4 text-white">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>

                        <p className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-5 text-muted-copy">
                          {getMessagePreview(lastMessage)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <div
            className={`h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[#faf7ef] ${selectedConversation ? "flex" : "flex max-[850px]:hidden"}`}
          >
            {!selectedConversation ? (
              <div className="grid h-full place-content-center justify-items-center p-8 text-center text-muted-copy">
                <MessageCircle size={48} />
                <h2 className="mb-1 mt-3 text-xl font-bold text-ink">
                  Select a conversation
                </h2>
                <p className="m-0">Choose a conversation to view its messages.</p>
              </div>
            ) : (
              <>
                <header className="flex shrink-0 items-center gap-3 border-b border-[#e4e3da] bg-[#fffefa] px-4 py-3.5 sm:px-5">
                  <button
                    type="button"
                    className="hidden size-10 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-sage-light/70 p-0 text-forest transition hover:bg-sage-light max-[850px]:grid"
                    onClick={() => setSelectedConversation(null)}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileUserId(otherUser?.id)}
                    aria-label={`View ${otherUserName}'s profile`}
                    title="View profile"
                    className="grid size-12 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-0 bg-forest p-0 font-serif text-base font-bold text-white ring-1 ring-forest/10 transition hover:ring-3 hover:ring-sage focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark"
                  >
                    {otherUser?.profile?.profileImageUrl || otherUser?.profileImageUrl ? (
                      <img
                        src={otherUser?.profile?.profileImageUrl || otherUser?.profileImageUrl}
                        alt={`${otherUserName}'s profile`}
                        className="size-full object-cover"
                      />
                    ) : (
                      otherUserName.charAt(0).toUpperCase()
                    )}
                  </button>

                  <div className="min-w-0 flex flex-col items-start">
                    <button
                      type="button"
                      onClick={() => setProfileUserId(otherUser?.id)}
                      title="View profile"
                      className="max-w-full cursor-pointer border-0 bg-transparent p-0 text-left text-forest transition hover:text-sage-dark focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-dark"
                    >
                      <div className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-1">
                        <h2 className="m-0 truncate font-serif text-lg font-bold leading-tight">
                          {otherUserName}
                        </h2>

                        <span className="text-xs font-semibold text-sage-dark">
                          {otherUser?.role === "OWNER"
                            ? "Owner"
                            : otherUser?.role === "ADMIN"
                              ? "Admin"
                              : "Member"}
                        </span>

                        <span className="text-xs text-muted-copy">·</span>

                        <span className="truncate text-xs text-muted-copy">
                          {getUserHandle(selectedConversation)}
                        </span>
                      </div>
                    </button>

                    <span className="mt-0.5 max-w-full truncate text-xs text-muted-copy">
                      {selectedConversation.property
                        ? selectedConversation.property.title
                        : "Admin support"}
                    </span>
                  </div>
                </header>

                <div
                  ref={messagesContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 scrollbar-none [&::-webkit-scrollbar]:hidden sm:px-6 sm:py-7 lg:px-8"
                >
                  {messageLoading ? (
                    <div className="grid h-full place-content-center text-muted-copy">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="grid h-full place-content-center text-center text-muted-copy">
                      <p className="m-0">No messages in this conversation.</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const messageId = message.id || message.messageId;
                      const myMessage = isMyMessage(message);

                      return (
                        <div
                          key={messageId}
                          className={`mb-3 flex ${myMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[min(82%,560px)] px-4 pb-2.5 pt-3.5 sm:max-w-[min(76%,560px)] ${myMessage ? "rounded-[18px] rounded-br-sm bg-forest text-white" : "rounded-[18px] rounded-bl-sm border border-[#e1e2d9] bg-[#fffefa] text-ink"}`}
                          >
                            {(message.content || message.message) && (
                              <p className={`m-0 wrap-anywhere text-sm leading-6 sm:text-[15px] ${isSharedListingMessage(message) ? "mb-2.5" : ""}`}>
                                {message.content || message.message}
                              </p>
                            )}
                            {isSharedListingMessage(message) && <SharedListingCard message={message} />}

                            <div
                              className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] font-medium ${myMessage ? "text-white/65" : "text-muted-copy/85"}`}
                            >
                              {message.createdAt
                                ? new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                                : ""}
                              {myMessage && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  {message.isRead ? (
                                    <CheckCheck size={15} aria-label="Read" />
                                  ) : (
                                    <Check size={15} aria-label="Sent" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  className="flex shrink-0 gap-2.5 border-t border-[#e4e3da] bg-[#fffefa] p-3 sm:p-4"
                  onSubmit={handleSendMessage}
                >
                  <input
                    type="text"
                    value={newMessage}
                    placeholder={`Write a message${otherUserName ? ` to ${otherUserName}` : ""}...`}
                    onChange={(event) => setNewMessage(event.target.value)}
                    disabled={sending}
                    className="min-w-0 flex-1 rounded-2xl border border-[#dedfd6] bg-[#faf8f2] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-copy/75 focus:border-sage-dark focus:bg-white focus:ring-3 focus:ring-sage-dark/10 disabled:opacity-60 sm:text-base"
                  />

                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className={`grid size-12 shrink-0 cursor-pointer place-items-center rounded-2xl border-0 bg-forest px-4 font-bold text-white transition hover:bg-[#244b3c] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark disabled:cursor-not-allowed disabled:opacity-50 ${isOwnerView ? "sm:w-auto sm:inline-flex sm:gap-2" : ""}`}
                  >
                    <Send size={19} />
                    {isOwnerView && <span>Send</span>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      {profileUserId && (
        <UserProfileModal
          userId={profileUserId}
          onClose={closeUserProfile}
        />
      )}
    </>
  );
};

export default ConversationList;
