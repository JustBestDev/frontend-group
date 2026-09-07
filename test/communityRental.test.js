import assert from "node:assert/strict";
import test from "node:test";
import { getCommunityReadiness } from "../src/utils/communityRental.js";

test("community readiness counts unique additional members, not the creator", () => {
  const post = { creatorId: 1, requiredMembers: 2, status: "OPEN" };
  const members = [
    { userId: 1 },
    { userId: 2 },
    { userId: 2 },
    { userId: 3 },
  ];

  assert.deepEqual(getCommunityReadiness(post, members), {
    additionalMemberCount: 2,
    remainingMembers: 0,
    isReady: true,
  });
});

test("FULL status is ready even when the member list is not loaded", () => {
  assert.equal(
    getCommunityReadiness(
      { creatorId: 1, requiredMembers: 2, status: "FULL" },
      [],
    ).isReady,
    true,
  );
});
