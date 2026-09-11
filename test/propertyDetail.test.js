import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCommunityPostPayload,
  getGalleryImages,
  getPropertyDetails,
} from "../src/utils/propertyDetail.js";

test("gallery uses listing images without fabricated fillers", () => {
  assert.deepEqual(getGalleryImages({ images: [{ imageUrl: "listing.jpg" }] }), ["listing.jpg"]);
  assert.deepEqual(getGalleryImages({}), []);
});

test("whole-unit reservations make the property and every room unavailable", () => {
  const details = getPropertyDetails({
    rentType: "WHOLE_UNIT",
    propertyStatus: "AVAILABLE",
    hasActiveRental: true,
    isReserved: true,
    rooms: [{ id: 1, status: "AVAILABLE" }],
  });

  assert.equal(details.isWholeUnitUnavailable, true);
  assert.equal(details.isUnavailableForCommunity, true);
  assert.equal(details.wholeUnitStatus, "RESERVED");
  assert.deepEqual(details.availableRooms, []);
});

test("individual-room properties remain shareable while a room is available", () => {
  const details = getPropertyDetails({
    rentType: "INDIVIDUAL_ROOM",
    propertyStatus: "AVAILABLE",
    rooms: [
      { id: 1, status: "RESERVED" },
      { id: 2, status: "AVAILABLE" },
    ],
  });

  assert.equal(details.isUnavailableForCommunity, false);
  assert.deepEqual(details.availableRooms.map((room) => room.id), [2]);
  assert.deepEqual(details.roomStatusCounts, { RESERVED: 1, AVAILABLE: 1 });
});

test("individual-room pricing is derived from actual room rents", () => {
  const details = getPropertyDetails({
    rentType: "INDIVIDUAL_ROOM",
    monthlyRent: 5000,
    rooms: [
      { id: 1, status: "RENTED", monthlyRent: 9500 },
      { id: 2, status: "AVAILABLE", monthlyRent: 7800 },
      { id: 3, status: "AVAILABLE", monthlyRent: 8200 },
    ],
  }, 2);

  assert.equal(details.roomStartingPrice, 7800);
  assert.equal(details.displayPrice, 7800);
  assert.equal(details.selectedRoom.id, 2);
});

test("room-context community shares include the selected room", () => {
  const payload = buildCommunityPostPayload(
    { id: 12, title: "Forest House" },
    12,
    { title: "Room B roommates", requireMember: 2, roomId: 9 },
  );

  assert.deepEqual(payload, {
    propertyId: 12,
    roomId: 9,
    title: "Room B roommates",
    description: "",
    requiredMembers: 2,
  });
});

test("missing room rents and address stay undisclosed", () => {
  const details = getPropertyDetails({
    rentType: "INDIVIDUAL_ROOM",
    rooms: [{ id: 1, status: "AVAILABLE", monthlyRent: null }],
  });

  assert.equal(details.roomStartingPrice, null);
  assert.equal(details.displayPrice, null);
  assert.equal(details.address, "");
});

test("active whole-unit rentals are reported as rented", () => {
  const details = getPropertyDetails({
    rentType: "WHOLE_UNIT",
    propertyStatus: "AVAILABLE",
    activeRental: { status: "ACTIVE" },
    rooms: [{ id: 1, status: "AVAILABLE" }],
  });

  assert.equal(details.hasActiveRental, true);
  assert.equal(details.isRented, true);
  assert.equal(details.wholeUnitStatus, "RENTED");
});
