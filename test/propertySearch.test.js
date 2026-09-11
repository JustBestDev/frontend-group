import assert from "node:assert/strict";
import test from "node:test";
import { getAllTransitStations } from "../src/data/bangkokTransit.js";
import { filterProperties } from "../src/utils/propertySearch.js";

const stations = getAllTransitStations();
const asok = stations.find(({ key }) => key === "BTS_SUKHUMVIT:E4");
const phromPhong = stations.find(({ key }) => key === "BTS_SUKHUMVIT:E5");

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
      latitude: asok.lat + 0.003,
      longitude: asok.lng,
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
      latitude: 13.7286,
      longitude: 100.5341,
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
    selectedStations: [asok.key],
  });

  assert.deepEqual(matches.map(({ id }) => id), [1]);
});

test("includes a property within the default 1 km transit radius", () => {
  const [match] = filterProperties(properties, {
    ...filters,
    selectedStations: [asok.key],
  });

  assert.equal(match.id, 1);
  assert.deepEqual(match.nearestTransitStation, {
    code: "E4",
    name: "Asok",
    lineName: "BTS Sukhumvit Line",
  });
  assert.ok(match.transitDistanceKm < 1);
  assert.equal(properties[0].nearestTransitStation, undefined);
});

test("excludes a property beyond the transit radius", () => {
  const farProperty = {
    ...properties[0],
    address: {
      ...properties[0].address,
      latitude: asok.lat + 0.02,
    },
  };

  assert.deepEqual(
    filterProperties([farProperty], {
      ...filters,
      selectedStations: [asok.key],
    }),
    [],
  );
});

test("uses the nearest of multiple selected stations", () => {
  const property = {
    ...properties[0],
    address: {
      ...properties[0].address,
      latitude: phromPhong.lat,
      longitude: phromPhong.lng,
    },
  };

  const [match] = filterProperties([property], {
    ...filters,
    selectedStations: [asok.key, phromPhong.key],
  });

  assert.equal(match.nearestTransitStation.code, "E5");
  assert.equal(match.transitDistanceKm, 0);
});

test("excludes missing coordinates only while transit filtering is active", () => {
  const property = {
    ...properties[0],
    address: { province: "Bangkok" },
  };

  assert.deepEqual(
    filterProperties([property], {
      ...filters,
      selectedStations: [asok.key],
    }),
    [],
  );
  assert.deepEqual(filterProperties([property], filters), [property]);
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
