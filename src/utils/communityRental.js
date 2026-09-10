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

export const parsePostGender = (rawDescription = "") => {
  if (!rawDescription) return { gender: "ANY", cleanDescription: "" };
  if (rawDescription.startsWith("[GENDER:FEMALE]")) {
    return {
      gender: "FEMALE",
      cleanDescription: rawDescription.replace("[GENDER:FEMALE]", "").trim(),
    };
  }
  if (rawDescription.startsWith("[GENDER:MALE]")) {
    return {
      gender: "MALE",
      cleanDescription: rawDescription.replace("[GENDER:MALE]", "").trim(),
    };
  }
  return {
    gender: "ANY",
    cleanDescription: rawDescription,
  };
};
