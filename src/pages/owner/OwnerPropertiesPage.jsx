import { Building2, MapPin, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import useOwnerStore from "../../stores/ownerStore.js";

const filters = ["ALL", "APPROVED", "PENDING", "REJECTED"];

const OwnerPropertiesPage = () => {
  const { properties, isLoading, error, getMyProperties } = useOwnerStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { getMyProperties().catch(() => { }); }, [getMyProperties]);

  const visibleProperties = useMemo(() => properties.filter((property) => {
    const matchesFilter = filter === "ALL" || property.publishStatus === filter;
    const matchesQuery = property.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, properties, query]);

  return <section className="owner-resource-page mx-auto w-full max-w-330">
    <header className="owner-resource-header mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
      <div>
        <p className="owner-eyebrow">Portfolio</p>
        <h1>My Properties</h1>
        <p>Manage your listings, rooms and publication status.</p>
      </div>
      <Link to="/owner/properties/new"
        className="owner-primary-button inline-flex items-center gap-2 rounded-xl bg-terracotta px-4.5 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50">
        <Plus size={18} />Add property
      </Link>
    </header>
    <div className="owner-toolbar mb-4.5 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
      <label className="owner-search flex w-full max-w-97.5 items-center gap-2 rounded-xl border border-line bg-surface px-3 max-md:max-w-none">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search properties</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search properties..." />
      </label>
      <div className="owner-filter-group flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1" aria-label="Filter properties">
        {filters.map((item) =>
          <button
            type="button"
            className={filter === item ? "active" : ""}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
            key={item}>{item === "ALL" ? "All" : item.toLowerCase()}
          </button>)}
      </div>
    </div>
    {error &&
      <p className="owner-alert rounded-xl bg-[#fde8e6] px-3.5 py-3 text-danger" role="alert">{error}</p>
    }
    {isLoading ?
      <div className="owner-loading grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy">
        Loading properties...
      </div> :
      visibleProperties.length === 0 ?
        <div className="owner-empty-state grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy">
          <Building2 size={42} />
          <h2>No properties found</h2>
          <p>Create a property or change your search filters.</p>
        </div> :
        <div className="owner-property-list grid gap-3">{visibleProperties.map((property) => {
          const cover = property.images?.find((image) => image.isCover) || property.images?.[0];
          const address = [property.address?.district, property.address?.province].filter(Boolean).join(", ");
          return <article key={property.id} className="owner-property-row flex min-w-0 gap-4.5 rounded-xl border border-line bg-surface p-3 shadow-[0_5px_16px_rgba(50,66,54,.05)] max-md:flex-col" >
            {cover ?
              <img src={cover.imageUrl} alt="" /> :
              <div className="owner-property-image">
                <Building2 size={28} />
              </div>
            }
            <div className="owner-property-copy min-w-0 flex-1 py-1 pr-1">
              <div className="owner-row-title flex items-start justify-between gap-4">
                <h2>{property.title}</h2>
                <span className={`owner-status status-${property.publishStatus?.toLowerCase()}`}>
                  {property.publishStatus}</span></div><p><MapPin size={15} />
                {address || "Address not added"}</p>
              <div className="owner-property-meta flex flex-wrap gap-x-4.5 gap-y-2 text-[13px] capitalize text-[#566158]">
                <span>{property.propertyType?.toLowerCase()}</span><span>{property.rooms?.length || 0} rooms</span>
                <span>{Number(property.monthlyRent || 0).toLocaleString()}/month</span>
              </div>
            </div>
          </article>;
        })}</div>}
  </section>;
};

export default OwnerPropertiesPage;

