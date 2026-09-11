import assert from "node:assert/strict";
import test from "node:test";
import {
  getCommunityListing,
  getCommunityReadiness,
} from "../src/utils/communityRental.js";

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

test("room-linked cards prefer the room cover and existing room route", () => {
  const listing = getCommunityListing({
    propertyId: 12,
    property: {
      id: 12,
      title: "Forest House",
      monthlyRent: 15000,
      images: [{ imageUrl: "property-cover.jpg", isCover: true }],
    },
    room: {
      id: 9,
      roomName: "Room B",
      monthlyRent: 9000,
      status: "AVAILABLE",
      capacity: 2,
      images: [
        { imageUrl: "room-first.jpg", isCover: false },
        { imageUrl: "room-cover.jpg", isCover: true },
      ],
    },
  });

  assert.equal(listing.title, "Room B");
  assert.equal(listing.monthlyRent, 9000);
  assert.equal(listing.imageUrl, "room-cover.jpg");
  assert.equal(listing.photoCount, 2);
  assert.equal(listing.path, "/properties/12/9");
});

test("listing images fall back from room to property, then to no image", () => {
  const roomFallback = getCommunityListing({
    property: { id: 12, title: "Home", images: [{ imageUrl: "property.jpg" }] },
    room: { id: 9, roomName: "Room", images: [] },
  });
  assert.equal(roomFallback.imageUrl, "property.jpg");
  assert.equal(roomFallback.photoCount, 1);
  assert.equal(getCommunityListing({ property: { id: 12, title: "Home" } }).imageUrl, null);
});
