import { Bath, BedDouble, Building2, MapPin, Ruler } from "lucide-react";

const formatLabel = (value) => value?.replaceAll("_", " ");

const PropertySummary = ({
  property,
  propertyId,
  address,
  isWholeUnit,
  rooms,
  roomStartingPrice,
  isReserved,
  isRented,
  isWholeUnitUnavailable,
}) => {
  const size = property.size ?? property.area;
  const bathrooms = property.bathrooms ?? property.bathroomCount;
  const bedrooms = isWholeUnit ? property.totalBedrooms : rooms.length;
  const price = isWholeUnit ? property.monthlyRent : roomStartingPrice;
  const specs = [
    size != null && { icon: Ruler, label: "Unit size", value: `${size} sq.m.` },
    bedrooms != null && bedrooms > 0 && {
      icon: BedDouble,
      label: "Configuration",
      value: `${bedrooms} ${Number(bedrooms) === 1 ? "bedroom" : "bedrooms"}`,
    },
    bathrooms != null && {
      icon: Bath,
      label: "Bathrooms",
      value: `${bathrooms} ${Number(bathrooms) === 1 ? "bathroom" : "bathrooms"}`,
    },
    { icon: Building2, label: "Lease style", value: isWholeUnit ? "Whole unit" : "Individual room" },
  ].filter(Boolean);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {property.propertyType && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest shadow-sm">{formatLabel(property.propertyType)}</span>}
        {property.rentType && <span className="rounded-full bg-sage-light px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest">{formatLabel(property.rentType)}</span>}
        {isWholeUnit && (
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${isWholeUnitUnavailable ? "bg-[#fde8e6] text-danger" : "bg-[#dcebd8] text-[#315d38]"}`}>
            {isReserved ? "Reserved" : isRented ? "Rented" : isWholeUnitUnavailable ? "Unavailable" : "Available"}
          </span>
        )}
        <span className="text-[11px] font-medium text-muted-copy">Listing #{propertyId}</span>
      </div>

      <h1 className="max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight text-forest sm:text-4xl lg:text-[42px]">
        {property.title || property.name || `Property #${propertyId}`}
      </h1>

      {address && <p className="mt-3 flex items-start gap-2 text-sm text-muted-copy"><MapPin className="mt-0.5 size-4 shrink-0 text-sage-dark" /><span>{address}</span></p>}

      <div className="mt-6 grid overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(50,66,54,.06)] sm:grid-cols-2 xl:grid-cols-4">
        {specs.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-h-22 items-center gap-3 px-5 py-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage-light text-sage-dark"><Icon size={17} aria-hidden="true" /></span>
            <span><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-muted-copy">{label}</span><strong className="mt-1 block font-serif text-base text-forest">{value}</strong></span>
          </div>
        ))}
        {price != null && (
          <div className="flex min-h-22 items-center px-5 py-4">
            <span><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-muted-copy">Pricing</span><strong className="mt-1 block font-serif text-lg text-forest">{isWholeUnit ? "฿" : "From ฿"}{Number(price).toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertySummary;
