import { useCallback, useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../services/api.js";

export default function useCommunityPosts(userId) {
  const [posts, setPosts] = useState(null);
  const [requestingPostId, setRequestingPostId] = useState(null);
  const [joinFeedback, setJoinFeedback] = useState(null);
  const [membersByPost, setMembersByPost] = useState({});
  const [rentalRequests, setRentalRequests] = useState([]);
  const [groupDataLoading, setGroupDataLoading] = useState(true);
  const [myRequestedPostIds, setMyRequestedPostIds] = useState(() => new Set());
  const fetchCommunity = useCallback(async () => {
    setGroupDataLoading(true);
    try {
      const response = await api.get("/community-posts");
      const nextPosts = Array.isArray(response.data) ? response.data : [];
      setPosts(nextPosts);

      const postsWithMembers = nextPosts.filter((post) => Boolean(post.id));
      const creatorPosts = userId
        ? postsWithMembers.filter(
            (post) =>
              Number(post.creatorId ?? post.creator?.id) === Number(userId) &&
              Boolean(post.propertyId) &&
              post.property?.rentType === "WHOLE_UNIT",
          )
        : [];

      if (postsWithMembers.length === 0) {
        setMembersByPost({});
        setRentalRequests([]);
        setGroupDataLoading(false);
        return;
      }

      try {
        const [memberEntries, requestResponse] = await Promise.all([
          Promise.all(
            postsWithMembers.map(async (post) => {
              const membersResponse = await api.get(
                `/community-posts/${post.id}/members`,
              );
              return [
                post.id,
                Array.isArray(membersResponse.data) ? membersResponse.data : [],
              ];
            }),
          ),
          creatorPosts.length > 0
            ? api.get("/rental-requests/me")
            : Promise.resolve({ data: [] }),
        ]);
        setMembersByPost(Object.fromEntries(memberEntries));
        setRentalRequests(
          Array.isArray(requestResponse.data.data)
            ? requestResponse.data.data
            : [],
        );
      } catch (error) {
        setJoinFeedback({
          message: getApiErrorMessage(
            error,
            "Unable to check group rental readiness",
          ),
          isError: true,
        });
      } finally {
        setGroupDataLoading(false);
      }
    } catch (error) {
      setPosts([]);
      setGroupDataLoading(false);
      setJoinFeedback({
        message: getApiErrorMessage(error, "Unable to load community posts"),
        isError: true,
      });
    }
  }, [userId]);

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchCommunity();
  }, [fetchCommunity]);

  const handleRequestToJoin = async (communityPostId) => {
    setRequestingPostId(communityPostId);
    setJoinFeedback(null);

    try {
      await api.post(`/community-posts/${communityPostId}/join-requests`, {
        message: "",
      });
      setMyRequestedPostIds((previousIds) =>
        new Set(previousIds).add(communityPostId),
      );
      setJoinFeedback({
        message: "Join request submitted successfully!",
        isError: false,
      });
    } catch (error) {
      if (error.response?.data?.message?.toLowerCase().includes("already")) {
        setMyRequestedPostIds((previousIds) =>
          new Set(previousIds).add(communityPostId),
        );
      }
      setJoinFeedback({
        message:
          error.response?.data?.message ||
          "Unable to submit your join request. Please try again.",
        isError: true,
      });
    } finally {
      setRequestingPostId(null);
    }
  };

  return {
    setRentalRequests,
    posts,
    requestingPostId,
    joinFeedback,
    setJoinFeedback,
    membersByPost,
    rentalRequests,
    groupDataLoading,
    myRequestedPostIds,
    fetchCommunity,
    handleRequestToJoin,
  };
}
