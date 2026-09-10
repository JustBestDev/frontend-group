import { Building2, BedDouble, Bath, MapPin } from "lucide-react";

const PropertySummary = ({ property, propertyId, address, isWholeUnit, rooms }) => {

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e1e5dd] shadow-xs">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="px-3 py-1 rounded-full bg-sage-light text-[#294c25] text-xs font-bold uppercase tracking-wider">
          {property.propertyType || "CONDO"}
        </span>
        <span className="px-3 py-1 rounded-full bg-[#f1f0ea] text-muted-copy text-xs font-semibold">
          {property.rentType
            ? property.rentType.replaceAll("_", " ")
            : "ROOM SHARE"}
        </span>
        <span className="text-xs text-[#889188] ml-auto">
          Listing #{propertyId}
        </span>
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1c16] tracking-tight mb-3">
        {property.title ||
          property.name ||
          "Quality Living Space Ready to Move In"}
      </h1>

      <p className="flex items-center gap-2 text-sm sm:text-[15px] text-muted-copy mb-6">
        <MapPin className="w-4 h-4 text-[#4f614d] shrink-0" />
        <span>{address}</span>
      </p>

      {/* Quick Specs Chips */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-5 border-t border-[#f1eee4] text-sm text-[#414753]">
        <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-xl border border-line">
          <Building2 className="w-4 h-4 text-[#4f614d]" />
          <span className="font-medium">
            {property.size || property.area
              ? `${property.size || property.area} sq.m.`
              : "Spacious Layout"}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-xl border border-line">
          <BedDouble className="w-4 h-4 text-[#4f614d]" />
          <span className="font-medium">
            {isWholeUnit
              ? property.totalBedrooms == null
                ? "— Bedrooms"
                : `${property.totalBedrooms} ${Number(property.totalBedrooms) === 1 ? "Bedroom" : "Bedrooms"}`
              : `${rooms.length} ${rooms.length === 1 ? "Bedroom" : "Bedrooms"}`}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-xl border border-line">
          <Bath className="w-4 h-4 text-[#4f614d]" />
          <span className="font-medium">
            {property.bathrooms
              ? `${property.bathrooms} ${property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}`
              : "Modern Bathroom"}
          </span>
        </div>
      </div>

      {/* Total Price Callout */}
      <div className="mt-6 pt-5 border-t border-[#f1eee4] flex items-baseline gap-2">
        <span className="font-serif text-3xl font-bold text-[#4f614d]">
          ฿
          {property.monthlyRent
            ? Number(property.monthlyRent).toLocaleString()
            : "Contact for Price"}
        </span>
        <span className="text-sm text-muted-copy">
          / month ({isWholeUnit ? "Entire unit" : "Starting room price"})
        </span>
      </div>
    </div>
  );
};

export default PropertySummary;
