import { useEffect, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../services/api.js";
import useAuthStore from "../../stores/authStore.js";
import { getConversationId } from "../../utils/conversations.js";

const getOtherUserName = (conversation, currentUserId) => {
  const user = conversation.members?.find(
    (member) => String(member.user?.id) !== String(currentUserId),
  )?.user;
  return [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(" ") || user?.username || "Conversation";
};

export default function ShareListingToConversation({ type, listingId, propertyId, ownerId, onShared }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/conversations")
      .then((response) => {
        const data = response.data.data?.conversations || response.data.conversations || response.data.data || [];
        const valid = (Array.isArray(data) ? data : []).filter(
          (conversation) => String(conversation.property?.id || conversation.propertyId) === String(propertyId),
        );
        setConversations(valid);
        if (valid.length === 1) setSelectedId(String(getConversationId(valid[0])));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load conversations"))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const handleSend = async () => {
    if (!selectedId && (!ownerId || String(ownerId) === String(user?.id || user?.userId))) return;
    setSending(true);
    setError("");
    try {
      let conversationId = selectedId;
      if (!conversationId) {
        const response = await api.post("/conversations", {
          propertyId: Number(propertyId),
          memberId: Number(ownerId),
        });
        const conversation = response.data.conversation || response.data.data?.conversation;
        conversationId = getConversationId(conversation);
        if (!conversationId) throw new Error("Conversation was not returned");
      }
      await api.post(`/conversations/${conversationId}/messages`, {
        type,
        ...(type === "ROOM_SHARE" ? { roomId: Number(listingId) } : { propertyId: Number(listingId) }),
      });
      onShared?.();
      navigate(user?.role === "OWNER" ? "/owner/messages" : user?.role === "ADMIN" ? "/admin/conversations" : "/Message", {
        state: { conversationId: Number(conversationId) },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to share this listing");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex items-center gap-2 py-4 text-sm text-muted-copy"><Loader2 size={16} className="animate-spin" /> Loading conversations...</div>;

  return (
    <div className="rounded-2xl border border-[#dce1d5] bg-[#fbfcf8] p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-forest">
        <MessageCircle size={19} />
        <h4 className="m-0 font-serif text-lg font-bold">Send in a message</h4>
      </div>
      {conversations.length ? (
        <div className="flex gap-2 max-sm:flex-col">
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-[#d8dccf] bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-sage-dark"
            aria-label="Choose conversation"
          >
            <option value="">Choose a conversation</option>
            {conversations.map((conversation) => (
              <option key={getConversationId(conversation)} value={getConversationId(conversation)}>
                {getOtherUserName(conversation, user?.id || user?.userId)}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleSend} disabled={!selectedId || sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-3 mt-0 text-sm text-muted-copy">No conversation exists for this property yet.</p>
          {ownerId && String(ownerId) !== String(user?.id || user?.userId) && (
            <button type="button" onClick={handleSend} disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Start conversation and send
            </button>
          )}
        </div>
      )}
      {error && <p role="alert" className="mb-0 mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
