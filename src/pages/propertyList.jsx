import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import {
  BedDouble,
  Building2,
  Filter,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import api from "../services/api.js";
import AuthModal from "../components/auth/AuthModal.jsx";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] =
    useState("ALL");
  const [priceRange, setPriceRange] =
    useState("ALL");
  const [bedrooms, setBedrooms] = useState("ALL");
  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
    }
  }

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
        Array.isArray(propertyData) ? propertyData : []
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

  const filteredProperties = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return properties.filter((property) => {
      const title = (
        property.title ||
        property.name ||
        ""
      ).toLowerCase();

      const location = (
        property.address?.fullAddress ||
        property.address?.district ||
        property.location ||
        property.city ||
        ""
      ).toLowerCase();

      const currentType =
        property.propertyType ||
        property.type ||
        "OTHER";

      const price = Number(property.price || 0);

      const roomCount =
        property.rooms?.length ||
        Number(property.bedrooms || 0);

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        location.includes(searchText);

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
          price > 10000 && price <= 20000;
      }

      if (priceRange === "OVER_20000") {
        matchesPrice = price > 20000;
      }

      const matchesBedrooms =
        bedrooms === "ALL" ||
        roomCount >= Number(bedrooms);

      return (
        matchesSearch &&
        matchesType &&
        matchesPrice &&
        matchesBedrooms
      );
    });
  }, [
    properties,
    search,
    propertyType,
    priceRange,
    bedrooms,
  ]);

  const clearFilters = () => {
    setSearch("");
    setPropertyType("ALL");
    setPriceRange("ALL");
    setBedrooms("ALL");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <main className="property-list-page">
      <header className="public-header">
        <Link
          className="public-brand"
          to="/properties"
        >
          <div className="public-brand-icon">
            <Building2 size={24} />
          </div>

          <span>RoomShare</span>
        </Link>

        <nav className="public-navigation">
          <Link to="/properties">Rent</Link>

          {currentUser?.role === "ADMIN" && (
            <Link to="/admin">Admin panel</Link>
          )}

          {token ? (
            <button
              type="button"
              className="public-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Log out
            </button>
          ) : (
            <button
              type="button"
              className="public-login-button"
              onClick={() =>
                setIsAuthModalOpen(true)
              }
            >
              Log in
            </button>
          )}
        </nav>
      </header>

      <section className="property-hero">
        <p>Find your next place</p>
        <h1>A better way to find a room</h1>
        <span>
          Discover rooms, homes and shared spaces that
          match your lifestyle.
        </span>
      </section>

      <section className="property-list-content">
        <div className="property-search-section">
          <div className="property-main-search">
            <Search size={21} />

            <input
              type="search"
              placeholder="Search location or property"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="property-filter-toolbar">
            <div className="filter-label">
              <Filter size={18} />
              Filters
            </div>

            <select
              value={propertyType}
              onChange={(event) =>
                setPropertyType(event.target.value)
              }
            >
              <option value="ALL">
                Property type
              </option>
              <option value="HOUSE">House</option>
              <option value="CONDO">Condo</option>
              <option value="APARTMENT">
                Apartment
              </option>
              <option value="DORMITORY">
                Dormitory
              </option>
              <option value="OTHER">Other</option>
            </select>

            <select
              value={priceRange}
              onChange={(event) =>
                setPriceRange(event.target.value)
              }
            >
              <option value="ALL">Price</option>
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
                  setBedrooms(event.target.value)
                }
              >
                <option value="ALL">Bedroom</option>
                <option value="1">1+ bedroom</option>
                <option value="2">2+ bedrooms</option>
                <option value="3">3+ bedrooms</option>
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
              {filteredProperties.length} listings found
            </p>
          </div>
        </div>

        {error && (
          <p className="admin-error" role="alert">
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
            {filteredProperties.map((property) => {
              const propertyId =
                property.id || property.propertyId;

              const image =
                property.images?.[0]?.imageUrl ||
                property.images?.[0]?.url ||
                property.imageUrl;

              const location =
                property.address?.fullAddress ||
                property.address?.district ||
                property.location ||
                property.city ||
                "Location not provided";

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

                    <div className="public-property-footer">
                      <strong>
                        {property.price
                          ? `฿${Number(
                              property.price
                            ).toLocaleString()}`
                          : "Contact for price"}
                      </strong>

                      <span>
                        {property.rentType
                          ?.replaceAll("_", " ") ||
                          "Rental"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
};

export default PropertyList;
