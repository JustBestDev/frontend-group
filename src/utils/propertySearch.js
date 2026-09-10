export function filterProperties(properties, {
  search,
  propertyType,
  rentType,
  priceRange,
  bedrooms,
  province,
  selectedStations = [],
}) {
  const searchText = search.trim().toLowerCase();
  const selectedStationCodes = selectedStations.map((stationKey) =>
    stationKey.split(":").at(-1).toUpperCase(),
  );

  return properties.filter((property) => {
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

    const matchesStation =
      selectedStationCodes.length === 0 ||
      selectedStationCodes.includes(stationCode);

    return (
      matchesSearch &&
      matchesType &&
      matchesRentType &&
      matchesPrice &&
      matchesBedrooms &&
      matchesProvince &&
      matchesStation
    );
  });
}
