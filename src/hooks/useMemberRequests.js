import { useCallback, useEffect, useRef, useState } from "react";
import api, { getApiErrorMessage } from "../services/api.js";

const getMemberName = (member) =>
  member?.user?.profile?.firstName ||
  member?.user?.username ||
  "Unknown member";

const getMemberAvatar = (member) =>
  member?.user?.profile?.profileImageUrl ||
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

export default function useMemberRequests(postId) {
  const [post, setPost] = useState(null);
  const [requests, setRequests] = useState([]);
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  const maxCapacity = Number(post?.requiredMembers) || 0;
  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const pendingCount = pendingRequests.length;
  const acceptedCount = acceptedMembers.length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;
  const isFull = acceptedCount >= maxCapacity;
  const spotsRemaining = Math.max(0, maxCapacity - acceptedCount);
  const capacityPercentage = Math.min(
    100,
    Math.round((acceptedCount / maxCapacity) * 100),
  );

  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const triggerToast = useCallback((message, isError = false) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, message, isError });
    toastTimer.current = setTimeout(() => {
      setToast({ show: false, message: "", isError: false });
    }, 3200);
  }, []);

  const loadPageData = useCallback(async () => {
    setLoading(true);
    try {
      const [postResponse, requestResponse, memberResponse] = await Promise.all(
        [
          api.get(`/community-posts/${postId}`),
          api.get(`/community-posts/${postId}/join-requests`),
          api.get(`/community-posts/${postId}/members`),
        ],
      );

      setPost(postResponse.data);
      setRequests(
        Array.isArray(requestResponse.data) ? requestResponse.data : [],
      );
      setAcceptedMembers(
        (Array.isArray(memberResponse.data) ? memberResponse.data : []).map(
          (member) => ({
            ...member,
            name: getMemberName(member),
            avatar: getMemberAvatar(member),
            badge: member.memberRole || "MEMBER",
            room: member.room?.roomName || "Not assigned",
          }),
        ),
      );
    } catch (error) {
      triggerToast(
        getApiErrorMessage(error, "Unable to load community requests"),
        true,
      );
    } finally {
      setLoading(false);
    }
  }, [postId, triggerToast]);

  useEffect(() => {
    // Refresh server state when the requested group changes.
    // oxlint-disable-next-line react/set-state-in-effect
    loadPageData();
  }, [loadPageData]);

  const handleRequestAction = async (applicant, action) => {
    if (action === "ACCEPT" && isFull) {
      triggerToast(
        `Cannot accept: group is already at maximum ${maxCapacity}/${maxCapacity} capacity`,
        true,
      );
      return;
    }
    setProcessingRequestId(applicant.id);
    try {
      await api.patch(`/join-requests/${applicant.id}`, { action });
      await loadPageData();
      triggerToast(
        action === "ACCEPT"
          ? `${getMemberName(applicant)} has been approved into the group!`
          : `Request from ${getMemberName(applicant)} was declined.`,
      );
    } catch (error) {
      triggerToast(
        getApiErrorMessage(error, "Unable to update join request"),
        true,
      );
    } finally {
      setProcessingRequestId(null);
    }
  };

  return {
    getMemberName,
    getMemberAvatar,
    triggerToast,
    post,
    requests,
    acceptedMembers,
    loading,
    processingRequestId,
    toast,
    maxCapacity,
    pendingRequests,
    pendingCount,
    acceptedCount,
    rejectedCount,
    isFull,
    spotsRemaining,
    capacityPercentage,
    handleRequestAction,
  };
}
