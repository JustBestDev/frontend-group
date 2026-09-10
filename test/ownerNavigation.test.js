import assert from "node:assert/strict";
import test from "node:test";

import {
  findOwnerRentalRequest,
  findOwnerRoom,
  ownerEditRoomPath,
  ownerPropertyPath,
  ownerRentalPath,
  ownerRentalRequestPath,
  ownerRentalRequestRoomPath,
  ownerRoomPath,
  ownerUserProfilePath,
} from "../src/utils/ownerRoutes.js";

test("owner room items navigate to the selected room", () => {
  assert.equal(ownerRoomPath(12, 34), "/owner/properties/12/rooms/34");
});

test("property room cards use the same canonical room route", () => {
  assert.equal(ownerRoomPath("12", "34"), "/owner/properties/12/rooms/34");
});

test("edit room remains separate from room detail navigation", () => {
  assert.equal(
    ownerEditRoomPath(12, 34),
    "/owner/properties/12/rooms/34/edit",
  );
  assert.notEqual(ownerEditRoomPath(12, 34), ownerRoomPath(12, 34));
});

test("owner rental items navigate to the selected rental", () => {
  assert.equal(ownerRentalPath(56), "/owner/rentals/56");
});

test("owner rental request items navigate to the selected request", () => {
  assert.equal(ownerRentalRequestPath(78), "/owner/rental-requests/78");
});

test("rental request requester and property links use owner routes", () => {
  assert.equal(ownerUserProfilePath(91), "/owner/users/91");
  assert.equal(ownerPropertyPath(12), "/owner/properties/12");
});

test("rental request room links use the selected room and omit missing rooms", () => {
  assert.equal(
    ownerRentalRequestRoomPath({ propertyId: 12, room: { id: 34 } }),
    "/owner/properties/12/rooms/34",
  );
  assert.equal(ownerRentalRequestRoomPath({ propertyId: 12, room: null }), null);
});

test("owner detail lookups return undefined for inaccessible or missing items", () => {
  const properties = [{ id: 1, rooms: [{ id: 2 }] }];
  const requests = [{ id: 3 }];

  assert.equal(findOwnerRoom(properties, 1, 2)?.id, 2);
  assert.equal(findOwnerRoom(properties, 9, 2), undefined);
  assert.equal(findOwnerRoom(properties, 1, 9), undefined);
  assert.equal(findOwnerRentalRequest(requests, 3)?.id, 3);
  assert.equal(findOwnerRentalRequest(requests, 9), undefined);
});
