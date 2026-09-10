import { Link } from "react-router";
import {
  BedDouble,
  Building2,
  Filter,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import usePropertySearch from "../hooks/usePropertySearch.js";

const filterSelectClass =
  "h-11 min-w-0 flex-1 basis-44 rounded-xl border border-[#cfd7cd] bg-[#fbfcfa] px-4 text-[13px] text-[#5e6d5e] outline-none transition hover:border-sage focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/15";

const HomePage = () => {
  const {
    search, setSearch, propertyType, setPropertyType, rentType, setRentType,
    priceRange, setPriceRange, bedrooms, setBedrooms, province, setProvince,
    loading, error, provinces, filteredProperties, fetchProperties, clearFilters,
  } = usePropertySearch();

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#465346]">
      <section className="flex flex-col items-center bg-[linear-gradient(110deg,rgba(68,86,69,0.96),rgba(113,138,114,0.82))] px-6 pb-26.25 pt-18 text-center text-white max-sm:pt-13.75">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[2px] text-[#e2ebe0]">
          Find your next place
        </p>
        <h1 className="mb-3.5 font-serif text-4xl md:text-5xl lg:text-[58px]">
          A better way to find a room
        </h1>
        <span className="max-w-157.5 text-base leading-7 text-[#e6ece4]">
          Discover rooms, homes and shared spaces that match your lifestyle.
        </span>
      </section>

      <section className="mx-auto -mt-10.75 w-[calc(100%-40px)] max-w-295 pb-17.5">
        <div className="rounded-[18px] border border-[#e0e5dd] bg-white p-4 shadow-[0_15px_45px_rgba(68,83,68,0.12)] sm:p-5">
          <div className="flex items-center gap-3 rounded-[14px] border border-[#cfd8cc] bg-[#fbfcfa] px-4.5 text-[#839083] transition focus-within:border-[#829583] focus-within:ring-4 focus-within:ring-[#829583]/15">
            <Search size={21} aria-hidden="true" />

            <input
              type="search"
              className="w-full bg-transparent py-4 text-base text-[#475547] outline-none placeholder:text-[#8a958a]"
              placeholder="Search location or property"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4.5">
            <div className="flex items-center gap-2 text-forest">
              <Filter size={17} aria-hidden="true" />
              <h2 className="text-sm font-bold">Filters</h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <select
                className={filterSelectClass}
                aria-label="Property type"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
              >
                <option value="ALL">Property type</option>
                <option value="HOUSE">House</option>
                <option value="CONDO">Condo</option>
                <option value="APARTMENT">Apartment</option>
                <option value="DORMITORY">Dormitory</option>
                <option value="OTHER">Other</option>
              </select>

              <select
                className={filterSelectClass}
                aria-label="Rent type"
                value={rentType}
                onChange={(event) => setRentType(event.target.value)}
              >
                <option value="ALL">Rent type</option>
                <option value="INDIVIDUAL_ROOM">Individual room</option>
                <option value="WHOLE_UNIT">Whole unit</option>
              </select>

              <select
                className={filterSelectClass}
                aria-label="Price range"
                value={priceRange}
                onChange={(event) => setPriceRange(event.target.value)}
              >
                <option value="ALL">Price</option>
                <option value="UNDER_5000">Under ฿5,000</option>
                <option value="5000_10000">฿5,000 – ฿10,000</option>
                <option value="10000_20000">฿10,000 – ฿20,000</option>
                <option value="OVER_20000">Over ฿20,000</option>
              </select>

              <div className="flex h-11 min-w-0 flex-1 basis-44 items-center gap-1 rounded-xl border border-[#cfd7cd] bg-[#fbfcfa] pl-3.5 text-[#667666] transition hover:border-sage focus-within:border-sage-dark focus-within:ring-3 focus-within:ring-sage-dark/15">
                <BedDouble size={18} aria-hidden="true" />

                <select
                  className="h-full min-w-0 w-full cursor-pointer bg-transparent pl-2 pr-8 text-[13px] text-[#5e6d5e] outline-none"
                  aria-label="Minimum bedrooms"
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value)}
                >
                  <option value="ALL">Bedroom</option>
                  <option value="1">1+ bedroom</option>
                  <option value="2">2+ bedrooms</option>
                  <option value="3">3+ bedrooms</option>
                </select>
              </div>

              <select
                className={filterSelectClass}
                aria-label="Province"
                value={province}
                onChange={(event) => setProvince(event.target.value)}
              >
                <option value="ALL">Province</option>

                {provinces.map((provinceName) => (
                  <option key={provinceName} value={provinceName}>
                    {provinceName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap justify-end gap-2.5 max-sm:*:flex-1">
              <button
                type="button"
                className="inline-flex h-11 min-w-26 items-center justify-center rounded-xl border border-[#ead1ce] bg-[#fff7f5] px-4 text-[13px] font-extrabold text-[#a35d57] transition hover:border-[#d8b4af] hover:bg-[#fcece9] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark/35"
                onClick={clearFilters}
              >
                Clear
              </button>

              <button
                type="button"
                className="inline-flex h-11 min-w-26 items-center justify-center gap-2 rounded-xl bg-sage-dark px-4 text-[13px] font-extrabold text-white transition hover:bg-forest focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark/35"
                onClick={fetchProperties}
              >
                <RefreshCw size={17} aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10.5 mb-5 flex items-end justify-between">
          <div>
            <h2 className="mb-1 font-serif text-[28px] text-[#465546]">
              Properties for rent
            </h2>
            <p className="text-[#8c958b]">
              {filteredProperties.length} listings found
            </p>
          </div>
        </div>

        {error && (
          <p
            className="mb-5 rounded-xl bg-red-50 p-3 text-danger"
            role="alert"
          >
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex min-h-70 items-center justify-center rounded-[17px] border border-[#e1e5dd] bg-white p-9 text-center text-[#8d968c]">
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex min-h-70 flex-col items-center justify-center rounded-[17px] border border-[#e1e5dd] bg-white p-9 text-center text-[#8d968c]">
            <Building2 size={42} />

            <h2 className="mt-3 mb-1.5 text-xl font-bold text-[#586858]">
              No properties found
            </h2>

            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5.5">
            {filteredProperties.map((property) => {
              const propertyId = property.id || property.propertyId;

              const image =
                property.images?.[0]?.imageUrl ||
                property.images?.[0]?.url ||
                property.imageUrl;

              const location =
                [
                  property.address?.subDistrict,
                  property.address?.district,
                  property.address?.province,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                property.location ||
                property.city ||
                "Location not provided";

              return (
                <article
                  className="group w-full overflow-hidden rounded-[17px] border border-[#e1e5dd] bg-white shadow-[0_8px_25px_rgba(67,81,67,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(67,81,67,0.13)] sm:w-[calc(50%-11px)] lg:w-[calc(33.333%-15px)]"
                  key={propertyId}
                >
                  <Link
                    to={`/properties/${propertyId}`}
                    className="relative flex h-51.25 items-center justify-center overflow-hidden bg-[#e8ede5] text-[#829382]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={property.title || "Property"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Building2 size={42} />
                    )}

                    <span className="absolute top-3.25 left-3.25 rounded-lg bg-white/90 px-2.5 py-1.5 text-[10px] font-extrabold text-[#546654]">
                      {property.propertyType || property.type || "PROPERTY"}
                    </span>
                  </Link>

                  <div className="p-4.5">
                    <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold text-[#475547]">
                      {property.title || property.name || "Untitled property"}
                    </h3>

                    <p className="my-3 flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-[13px] text-ellipsis text-[#889188]">
                      <MapPin className="shrink-0" size={15} aria-hidden="true" />
                      <span className="overflow-hidden text-ellipsis">
                        {location}
                      </span>
                    </p>

                    <div className="flex items-center justify-between gap-3 border-t border-[#edf0ea] pt-4">
                      <strong className="text-[17px] text-[#607861]">
                        {(property.monthlyRent ?? property.price) != null
                          ? `฿${Number(
                            property.monthlyRent ?? property.price,
                          ).toLocaleString()}`
                          : "Contact for price"}
                      </strong>

                      <span className="text-right text-[11px] capitalize text-[#939a92]">
                        {property.rentType?.replaceAll("_", " ") || "Rental"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
