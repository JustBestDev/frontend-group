import assert from "node:assert/strict";
import test from "node:test";
import { filterProperties } from "../src/utils/propertySearch.js";

const filters = {
  search: "",
  propertyType: "ALL",
  rentType: "ALL",
  priceRange: "ALL",
  bedrooms: "ALL",
  province: "ALL",
};

const properties = [
  {
    id: 1,
    title: "Asok Condo",
    propertyType: "CONDO",
    rentType: "WHOLE_UNIT",
    monthlyRent: 18000,
    totalBedrooms: 2,
    address: {
      province: "Bangkok",
      nearestStationCode: "E4",
      nearestStationName: "Asok",
    },
  },
  {
    id: 2,
    title: "Silom Room",
    propertyType: "APARTMENT",
    rentType: "INDIVIDUAL_ROOM",
    monthlyRent: 9000,
    totalBedrooms: 1,
    address: {
      province: "Bangkok",
      nearestStationCode: "BL26",
      nearestStationName: "Si Lom",
    },
  },
];

test("combines transit selection with the existing property filters", () => {
  const matches = filterProperties(properties, {
    ...filters,
    propertyType: "CONDO",
    rentType: "WHOLE_UNIT",
    priceRange: "10000_20000",
    bedrooms: "2",
    province: "Bangkok",
    selectedStations: ["bts-sukhumvit:E4"],
  });

  assert.deepEqual(matches.map(({ id }) => id), [1]);
});

test("searches properties by station name or code", () => {
  assert.deepEqual(
    filterProperties(properties, { ...filters, search: "si lom" }).map(
      ({ id }) => id,
    ),
    [2],
  );
  assert.deepEqual(
    filterProperties(properties, { ...filters, search: "e4" }).map(
      ({ id }) => id,
    ),
    [1],
  );
});
