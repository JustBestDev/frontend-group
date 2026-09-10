import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  BedDouble,
  Building2,
  Filter,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../services/api.js";
import TransitMapModal from "../components/search/TransitMapModal.jsx";
import LocationSearchMenu from "../components/search/LocationSearchMenu.jsx";

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] =
    useState("ALL");
  const [priceRange, setPriceRange] =
    useState("ALL");
  const [bedrooms, setBedrooms] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [
    isSearchMenuOpen,
    setIsSearchMenuOpen,
  ] = useState(false);

  const [
    isTransitModalOpen,
    setIsTransitModalOpen,
  ] = useState(false);

  const [
    selectedStations,
    setSelectedStations,
  ] = useState([]);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/properties");

      const propertyData =
        response.data.data?.properties ||
        response.data.data ||
        response.data.properties ||
        [];

      setProperties(
        Array.isArray(propertyData)
          ? propertyData
          : []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve properties"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const selectedStationCodes = useMemo(() => {
    return selectedStations.map((stationKey) => {
      const parts = stationKey.split(":");
      return parts[parts.length - 1];
    });
  }, [selectedStations]);

  const filteredProperties = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return properties.filter((property) => {
      const title = (
        property.title ||
        property.name ||
        ""
      ).toLowerCase();

      const location = (
        property.address?.fullAddress ||
        property.address?.district ||
        property.address?.subDistrict ||
        property.address?.province ||
        property.location ||
        property.city ||
        ""
      ).toLowerCase();

      const stationName = (
        property.address?.nearestStationName ||
        ""
      ).toLowerCase();

      const stationCode =
        property.address?.nearestStationCode || "";

      const currentType =
        property.propertyType ||
        property.type ||
        "OTHER";

      const price = Number(
        property.monthlyRent ??
          property.price ??
          0
      );

      const roomCount =
        property.rooms?.length ||
        Number(
          property.totalBedrooms ||
            property.bedrooms ||
            0
        );

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        location.includes(searchText) ||
        stationName.includes(searchText) ||
        stationCode
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        propertyType === "ALL" ||
        currentType === propertyType;

      let matchesPrice = true;

      if (priceRange === "UNDER_5000") {
        matchesPrice = price < 5000;
      }

      if (priceRange === "5000_10000") {
        matchesPrice =
          price >= 5000 && price <= 10000;
      }

      if (priceRange === "10000_20000") {
        matchesPrice =
          price > 10000 &&
          price <= 20000;
      }

      if (priceRange === "OVER_20000") {
        matchesPrice = price > 20000;
      }

      const matchesBedrooms =
        bedrooms === "ALL" ||
        roomCount >= Number(bedrooms);

      const matchesStation =
        selectedStationCodes.length === 0 ||
        selectedStationCodes.includes(
          stationCode
        );

      return (
        matchesSearch &&
        matchesType &&
        matchesPrice &&
        matchesBedrooms &&
        matchesStation
      );
    });
  }, [
    properties,
    search,
    propertyType,
    priceRange,
    bedrooms,
    selectedStationCodes,
  ]);

  const clearFilters = () => {
    setSearch("");
    setPropertyType("ALL");
    setPriceRange("ALL");
    setBedrooms("ALL");
    setSelectedStations([]);
    setIsSearchMenuOpen(false);
  };

  const handleApplyStations = (
    stationKeys
  ) => {
    setSelectedStations(stationKeys);
    setIsTransitModalOpen(false);
    setIsSearchMenuOpen(false);
  };

  return (
    <main className="property-list-page">
      <section className="property-hero">
        <p>Find your next place</p>

        <h1>A better way to find a room</h1>

        <span>
          Discover rooms, homes and shared spaces
          that match your lifestyle.
        </span>
      </section>

      <section className="property-list-content">
        <div className="property-search-section">
          <div className="property-search-wrapper">
            <div className="property-main-search">
              <Search size={21} />

              <input
                type="search"
                placeholder="Search location, station or property"
                value={search}
                onFocus={() =>
                  setIsSearchMenuOpen(true)
                }
                onChange={(event) => {
                  setSearch(event.target.value);
                  setIsSearchMenuOpen(true);
                }}
              />
            </div>

            <LocationSearchMenu
              isOpen={isSearchMenuOpen}
              onTransitClick={() => {
                setIsSearchMenuOpen(false);
                setIsTransitModalOpen(true);
              }}
            />

            {selectedStations.length > 0 && (
              <div className="property-selected-stations">
                <span>
                  {selectedStations.length} station
                  {selectedStations.length > 1
                    ? "s"
                    : ""}{" "}
                  selected
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedStations([])
                  }
                >
                  Clear stations
                </button>
              </div>
            )}
          </div>

          <div className="property-filter-toolbar">
            <div className="filter-label">
              <Filter size={18} />
              Filters
            </div>

            <select
              value={propertyType}
              onChange={(event) =>
                setPropertyType(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                Property type
              </option>

              <option value="HOUSE">
                House
              </option>

              <option value="CONDO">
                Condo
              </option>

              <option value="APARTMENT">
                Apartment
              </option>

              <option value="DORMITORY">
                Dormitory
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>

            <select
              value={priceRange}
              onChange={(event) =>
                setPriceRange(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                Price
              </option>

              <option value="UNDER_5000">
                Under ฿5,000
              </option>

              <option value="5000_10000">
                ฿5,000 – ฿10,000
              </option>

              <option value="10000_20000">
                ฿10,000 – ฿20,000
              </option>

              <option value="OVER_20000">
                Over ฿20,000
              </option>
            </select>

            <div className="bedroom-filter">
              <BedDouble size={18} />

              <select
                value={bedrooms}
                onChange={(event) =>
                  setBedrooms(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  Bedroom
                </option>

                <option value="1">
                  1+ bedroom
                </option>

                <option value="2">
                  2+ bedrooms
                </option>

                <option value="3">
                  3+ bedrooms
                </option>
              </select>
            </div>

            <button
              type="button"
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear
            </button>

            <button
              type="button"
              className="refresh-property-button"
              onClick={fetchProperties}
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>

        <div className="property-results-heading">
          <div>
            <h2>Properties for rent</h2>

            <p>
              {filteredProperties.length} listings
              found
            </p>
          </div>
        </div>

        {error && (
          <p
            className="admin-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {loading ? (
          <div className="public-empty-state">
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="public-empty-state">
            <Building2 size={42} />

            <h2>No properties found</h2>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="public-property-grid">
            {filteredProperties.map(
              (property) => {
                const propertyId =
                  property.id ||
                  property.propertyId;

                const image =
                  property.images?.[0]
                    ?.imageUrl ||
                  property.images?.[0]?.url ||
                  property.imageUrl;

                const location =
                  property.address?.fullAddress ||
                  property.address?.district ||
                  property.address?.province ||
                  property.location ||
                  property.city ||
                  "Location not provided";

                const stationName =
                  property.address
                    ?.nearestStationName;

                const stationCode =
                  property.address
                    ?.nearestStationCode;

                return (
                  <article
                    className="public-property-card"
                    key={propertyId}
                  >
                    <Link
                      to={`/properties/${propertyId}`}
                      className="public-property-image"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={
                            property.title ||
                            "Property"
                          }
                        />
                      ) : (
                        <Building2 size={42} />
                      )}

                      <span>
                        {property.propertyType ||
                          property.type ||
                          "PROPERTY"}
                      </span>
                    </Link>

                    <div className="public-property-body">
                      <h3>
                        {property.title ||
                          property.name ||
                          "Untitled property"}
                      </h3>

                      <p className="public-property-location">
                        <MapPin size={15} />
                        {location}
                      </p>

                      {stationName && (
                        <p className="public-property-location">
                          🚆{" "}
                          {stationCode
                            ? `${stationCode} `
                            : ""}
                          {stationName}
                        </p>
                      )}

                      <div className="public-property-footer">
                        <strong>
                          {(property.monthlyRent ??
                            property.price) !=
                          null
                            ? `฿${Number(
                                property.monthlyRent ??
                                  property.price
                              ).toLocaleString()}`
                            : "Contact for price"}
                        </strong>

                        <span>
                          {property.rentType?.replaceAll(
                            "_",
                            " "
                          ) || "Rental"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      <TransitMapModal
        isOpen={isTransitModalOpen}
        selectedStationKeys={
          selectedStations
        }
        onClose={() =>
          setIsTransitModalOpen(false)
        }
        onApply={handleApplyStations}
      />
    </main>
  );
};

export default HomePage;