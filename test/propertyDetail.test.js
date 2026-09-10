import assert from "node:assert/strict";
import test from "node:test";

import { getPropertyDetails } from "../src/utils/propertyDetail.js";

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
