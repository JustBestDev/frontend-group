export const getCommunityReadiness = (post, members = []) => {
  const creatorId = post.creatorId ?? post.creator?.id;
  const additionalMemberIds = new Set(
    members
      .map((member) => member.userId ?? member.user?.id)
      .filter(
        (memberId) =>
          memberId != null && Number(memberId) !== Number(creatorId),
      ),
  );
  const requiredMembers = Number(post.requiredMembers) || 0;
  const additionalMemberCount = additionalMemberIds.size;

  return {
    additionalMemberCount,
    remainingMembers: Math.max(0, requiredMembers - additionalMemberCount),
    isReady:
      post.status === "FULL" || additionalMemberCount >= requiredMembers,
  };
};
