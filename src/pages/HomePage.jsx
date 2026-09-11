import { useState } from "react";
import { Link } from "react-router";
import { Building2, Camera, MapPin, RefreshCw, Search, TrainFront } from "lucide-react";
import usePropertySearch from "../hooks/usePropertySearch.js";
import TransitMapModal from "../components/search/TransitMapModal.jsx";
import heroImage from "../assets/roomhub-home-hero.png";

const filterSelectClass =
  "h-11 min-w-42 shrink-0 cursor-pointer rounded-full border border-[#c7cec5] bg-[#fbfaf6] px-4 text-[13px] font-semibold text-[#3f493f] outline-none transition hover:border-sage-dark focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/15 lg:min-w-0 lg:flex-1 lg:px-3";

const HomePage = () => {
  const {
    search, setSearch, propertyType, setPropertyType, rentType, setRentType,
    priceRange, setPriceRange, bedrooms, setBedrooms, province, setProvince,
    selectedStations, setSelectedStations, loading, error, provinces,
    filteredProperties, fetchProperties, clearFilters,
  } = usePropertySearch();
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);

  const handleApplyStations = (stationKeys) => {
    setSelectedStations(stationKeys);
    setIsTransitModalOpen(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf7f0] text-ink">
      <section
        className="relative min-h-96 bg-cover bg-center text-white sm:min-h-102 lg:min-h-94"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,48,39,0.74)_0%,rgba(20,50,40,0.58)_42%,rgba(20,44,36,0.36)_100%)]" />
        <div className="relative mx-auto w-full max-w-295 px-4 pt-20 sm:px-8 sm:pt-22 lg:px-12 xl:px-0">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#dfe9dd]">
            Find your next place
          </p>
          <h1 className="max-w-190 font-serif text-[40px] leading-[1.06] tracking-[-0.02em] sm:text-5xl lg:text-[58px]">
            A better way to find a room.
          </h1>
          <p className="mt-5 max-w-145 text-base leading-7 text-white/78 sm:text-lg">
            Discover rooms, homes and shared spaces that match your lifestyle.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 w-full max-w-305 px-4 pb-24 sm:px-8 lg:px-12">
        <div className="overflow-visible rounded-[22px] bg-white shadow-[0_18px_50px_rgba(44,55,45,0.12)]">
          <div className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row">
            <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#d3d8d1] bg-[#fffefb] px-4 text-[#737d75] transition focus-within:border-sage-dark focus-within:ring-3 focus-within:ring-sage-dark/12">
              <Search className="shrink-0" size={20} aria-hidden="true" />
              <span className="sr-only">Search properties</span>
              <input
                type="search"
                className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-[#858d87]"
                placeholder="Search location, station or property"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#f6f2e9] px-5 text-sm font-bold text-forest transition hover:bg-sage-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark/35 lg:min-w-51"
              onClick={() => setIsTransitModalOpen(true)}
            >
              <TrainFront size={18} aria-hidden="true" />
              BTS / MRT Station
              {selectedStations.length > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-forest text-[10px] text-white">
                  {selectedStations.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#efeee8] px-4 py-4 sm:px-5 lg:flex-row lg:items-center">
            <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-1 lg:flex-nowrap lg:overflow-visible lg:pb-0">
              <select className={filterSelectClass} aria-label="Property type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                <option value="ALL">Property Type: All</option>
                <option value="HOUSE">Property Type: House</option>
                <option value="CONDO">Property Type: Condo</option>
                <option value="APARTMENT">Property Type: Apartment</option>
                <option value="DORMITORY">Property Type: Dormitory</option>
                <option value="OTHER">Property Type: Other</option>
              </select>
              <select className={filterSelectClass} aria-label="Rent type" value={rentType} onChange={(event) => setRentType(event.target.value)}>
                <option value="ALL">Rent Type: All</option>
                <option value="INDIVIDUAL_ROOM">Rent Type: Individual room</option>
                <option value="WHOLE_UNIT">Rent Type: Whole unit</option>
              </select>
              <select className={filterSelectClass} aria-label="Price range" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                <option value="ALL">Price: All</option>
                <option value="UNDER_5000">Under ฿5,000</option>
                <option value="5000_10000">฿5,000 – ฿10,000</option>
                <option value="10000_20000">฿10,000 – ฿20,000</option>
                <option value="OVER_20000">Over ฿20,000</option>
              </select>
              <select className={filterSelectClass} aria-label="Minimum bedrooms" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
                <option value="ALL">Bedrooms: Any</option>
                <option value="1">Bedrooms: 1+</option>
                <option value="2">Bedrooms: 2+</option>
                <option value="3">Bedrooms: 3+</option>
              </select>
              <select className={`${filterSelectClass} min-w-47 lg:min-w-0`} aria-label="Province" value={province} onChange={(event) => setProvince(event.target.value)}>
                <option value="ALL">Province: All</option>
                {provinces.map((provinceName) => (
                  <option key={provinceName} value={provinceName}>Province: {provinceName}</option>
                ))}
              </select>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1 max-sm:grid max-sm:grid-cols-2 max-sm:gap-2 lg:ml-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-[13px] font-semibold text-[#747d76] transition hover:bg-[#f5f4ef] hover:text-forest focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-sage-dark/35 sm:px-4"
                onClick={clearFilters}
              >
                Clear filters
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-l border-[#e2e2dc] px-3 text-[13px] font-semibold text-[#747d76] transition hover:bg-[#f5f4ef] hover:text-forest focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-sage-dark/35 max-sm:border-l-0 sm:px-4"
                onClick={fetchProperties}
              >
                <RefreshCw size={14} aria-hidden="true" />
                Refresh listings
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 mt-8 flex items-end justify-between gap-4 sm:mt-9">
          <h2 className="font-serif text-[27px] leading-tight tracking-[-0.02em] text-forest sm:text-[32px]">
            Places you can call home
          </h2>
          <p className="shrink-0 pb-1 text-xs font-semibold text-[#707a72]">
            {filteredProperties.length} listings found
          </p>
        </div>

        {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-danger" role="alert">{error}</p>}

        {loading ? (
          <div className="grid min-h-70 place-items-center rounded-[18px] bg-white p-9 text-center text-[#7f8981] shadow-[0_8px_25px_rgba(67,81,67,0.05)]">
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex min-h-70 flex-col items-center justify-center rounded-[18px] bg-white p-9 text-center text-[#7f8981] shadow-[0_8px_25px_rgba(67,81,67,0.05)]">
            <Building2 size={42} aria-hidden="true" />
            <h2 className="mb-1.5 mt-3 text-xl font-bold text-[#536355]">No properties found</h2>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => {
              const propertyId = property.id || property.propertyId;
              const image = property.images?.[0]?.imageUrl || property.images?.[0]?.url || property.imageUrl;
              const title = property.title || property.name || "Untitled property";
              const location = [
                property.address?.subDistrict,
                property.address?.district,
                property.address?.province,
              ].filter(Boolean).join(", ") || property.location || property.city || "Location not provided";
              const stationName = property.address?.nearestStationName;
              const stationCode = property.address?.nearestStationCode;
              const nearestTransitStation = property.nearestTransitStation;
              const hasTransitMetadata =
                nearestTransitStation && property.transitDistanceKm != null;
              const monthlyRent = property.monthlyRent ?? property.price;

              return (
                <article
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_7px_24px_rgba(48,59,49,0.055)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(48,59,49,0.11)]"
                  key={propertyId}
                >
                  <Link
                    to={`/properties/${propertyId}`}
                    state={hasTransitMetadata ? {
                      nearestTransitStation,
                      transitDistanceKm: property.transitDistanceKm,
                    } : undefined}
                    className="relative aspect-4/3 overflow-hidden bg-[#ebe9e2]"
                    aria-label={`View ${title}`}
                  >
                    {image ? (
                      <img src={image} alt={title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                    ) : (
                      <div className="grid size-full place-items-center bg-[linear-gradient(145deg,#eeece6,#e5e3dc)] text-[#8c948d]">
                        <div className="flex flex-col items-center gap-3 text-xs font-medium">
                          <span className="grid size-12 place-items-center rounded-full bg-white/90 shadow-sm">
                            <Camera size={22} aria-hidden="true" />
                          </span>
                          Image not available
                        </div>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/94 px-3 py-1.5 text-[11px] font-bold capitalize text-forest shadow-sm">
                      {(property.propertyType || property.type || "Property").replaceAll("_", " ").toLowerCase()}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="truncate text-[18px] font-bold text-[#2f352f]">{title}</h3>
                    <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[13px] text-[#7c857e]">
                      <MapPin className="shrink-0" size={14} aria-hidden="true" />
                      <span className="truncate">{location}</span>
                    </p>
                    <div className="mb-4 mt-3 flex min-h-6 flex-wrap items-center justify-between gap-3 text-[12px] text-[#747e76] sm:flex-nowrap">
                      {hasTransitMetadata ? (
                        <span
                          className="inline-flex min-w-0 items-center gap-1.5 rounded-md bg-[#edf3e9] px-2 py-1 text-[#5e755f]"
                          title={nearestTransitStation.lineName}
                        >
                          <TrainFront className="shrink-0" size={13} aria-hidden="true" />
                          <span className="truncate">
                            {nearestTransitStation.code ? `${nearestTransitStation.code} ` : ""}
                            {nearestTransitStation.name} · {Number(property.transitDistanceKm).toFixed(1)} km
                          </span>
                        </span>
                      ) : stationName ? (
                        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-md bg-[#edf3e9] px-2 py-1 text-[#5e755f]">
                          <TrainFront className="shrink-0" size={13} aria-hidden="true" />
                          <span className="truncate">{stationName}{stationCode ? ` (${stationCode})` : ""}</span>
                        </span>
                      ) : <span />}
                      <span className="shrink-0 capitalize">{property.rentType?.replaceAll("_", " ") || "Rental"}</span>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eeeee9] pt-4">
                      <span className="text-[13px] text-[#646e66]">Monthly Rent</span>
                      <strong className="text-right text-[22px] leading-none text-forest">
                        {monthlyRent != null ? `฿${Number(monthlyRent).toLocaleString()}` : "Contact for price"}
                        {monthlyRent != null && <span className="ml-1 text-[12px] font-normal text-[#838b85]">/ mo</span>}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <TransitMapModal
        isOpen={isTransitModalOpen}
        selectedStationKeys={selectedStations}
        onClose={() => setIsTransitModalOpen(false)}
        onApply={handleApplyStations}
      />
    </main>
  );
};

export default HomePage;
