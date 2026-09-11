import {
  getAllTransitStations,
  haversineDistanceKm,
} from "../data/bangkokTransit.js";

export const DEFAULT_TRANSIT_RADIUS_KM = 1;

const transitStationsByKey = new Map(
  getAllTransitStations().map((station) => [station.key, station]),
);

const parseCoordinate = (value, minimum, maximum) => {
  if (value === null || value === undefined || value === "") return null;

  const coordinate = Number(value);
  return Number.isFinite(coordinate) &&
    coordinate >= minimum &&
    coordinate <= maximum
    ? coordinate
    : null;
};

export function filterProperties(
  properties,
  {
    search,
    propertyType,
    rentType,
    priceRange,
    bedrooms,
    province,
    selectedStations = [],
    transitRadiusKm = DEFAULT_TRANSIT_RADIUS_KM,
  },
) {
  const searchText = search.trim().toLowerCase();
  const selectedTransitStations = selectedStations.map((stationKey) =>
    transitStationsByKey.get(stationKey),
  );
  const hasTransitFilter = selectedStations.length > 0;

  return properties.flatMap((property) => {
    const title = (property.title || property.name || "").toLowerCase();

    const location = [
      property.address?.subDistrict,
      property.address?.district,
      property.address?.province,
      property.address?.postcode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const currentType = property.propertyType || property.type || "OTHER";
    const currentRentType = property.rentType || "";
    const currentProvince = property.address?.province || "";
    const stationName = (property.address?.nearestStationName || "").toLowerCase();
    const stationCode = String(
      property.address?.nearestStationCode || "",
    ).toUpperCase();

    const price = Number(property.monthlyRent ?? property.price ?? 0);

    const roomCount = Number(
      property.totalBedrooms ??
      property.bedrooms ??
      property.rooms?.length ??
      0,
    );

    const matchesSearch =
      !searchText ||
      title.includes(searchText) ||
      location.includes(searchText) ||
      stationName.includes(searchText) ||
      stationCode.toLowerCase().includes(searchText);

    const matchesType =
      propertyType === "ALL" || currentType === propertyType;

    const matchesRentType =
      rentType === "ALL" || currentRentType === rentType;

    const matchesProvince =
      province === "ALL" || currentProvince === province;

    let matchesPrice = true;

    if (priceRange === "UNDER_5000") {
      matchesPrice = price < 5000;
    }

    if (priceRange === "5000_10000") {
      matchesPrice = price >= 5000 && price <= 10000;
    }

    if (priceRange === "10000_20000") {
      matchesPrice = price > 10000 && price <= 20000;
    }

    if (priceRange === "OVER_20000") {
      matchesPrice = price > 20000;
    }

    const matchesBedrooms =
      bedrooms === "ALL" || roomCount >= Number(bedrooms);

    const matchesExistingFilters =
      matchesSearch &&
      matchesType &&
      matchesRentType &&
      matchesPrice &&
      matchesBedrooms &&
      matchesProvince;

    if (!matchesExistingFilters) return [];
    if (!hasTransitFilter) return [property];
    if (selectedTransitStations.some((station) => !station)) return [];

    const latitude = parseCoordinate(property.address?.latitude, -90, 90);
    const longitude = parseCoordinate(property.address?.longitude, -180, 180);

    if (latitude === null || longitude === null) return [];

    const nearest = selectedTransitStations.reduce((current, station) => {
      const distanceKm = haversineDistanceKm(
        latitude,
        longitude,
        station.lat,
        station.lng,
      );

      return !current || distanceKm < current.distanceKm
        ? { station, distanceKm }
        : current;
    }, null);

    if (!nearest || nearest.distanceKm > transitRadiusKm) return [];

    return [
      {
        ...property,
        nearestTransitStation: {
          code: nearest.station.code,
          name: nearest.station.name,
          lineName: nearest.station.lineName,
        },
        transitDistanceKm: Number(nearest.distanceKm.toFixed(2)),
      },
    ];
  });
}
