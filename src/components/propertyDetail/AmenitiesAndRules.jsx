import { propertyOptionIcons } from "../../utils/propertyOptions.js";

const AmenitiesAndRules = ({ property }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e1e5dd] shadow-xs space-y-6">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16] mb-3">
          About This Property
        </h2>
        <div className="text-sm leading-relaxed text-[#414753] whitespace-pre-line space-y-3">
          {property.description ? (
            <p>{property.description}</p>
          ) : (
            <p className="text-muted-copy">
              Move-in ready space featuring ample natural light,
              functional layout, and convenient access to local transit
              and amenities. Ideal for students and professionals
              seeking a warm, respectful roommate community.
            </p>
          )}
        </div>
      </div>
      <div className="pt-6 border-t border-[#f1eee4]">
        <h3 className="font-serif text-lg font-bold text-[#1c1c16] mb-3">
          Amenities
        </h3>
        {property.amenities?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#505a54]">
            {property.amenities.map((amenity) => {
              const Icon = propertyOptionIcons[amenity.code];
              return (
                <div
                  key={amenity.id}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f5ee]"
                >
                  {Icon && <Icon size={18} className="text-[#4f614d] shrink-0" aria-hidden="true" />}
                  <span>{amenity.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-copy">
            No specific amenities listed for this property.
          </p>
        )}
      </div>

      <div className="pt-6 border-t border-[#f1eee4]">
        <h3 className="font-serif text-lg font-bold text-[#1c1c16] mb-3">
          House Rules
        </h3>
        {property.houseRules?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#505a54]">
            {property.houseRules.map((rule) => {
              const Icon = propertyOptionIcons[rule.code];
              const formattedValue = rule.value
                ? `: ${rule.value.includes("-") ? rule.value.replace("-", " – ") : rule.value}`
                : "";
              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f5ee]"
                >
                  {Icon && <Icon size={18} className="text-[#4f614d] shrink-0" aria-hidden="true" />}
                  <span>
                    {rule.name}{formattedValue}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-copy">
            No specific house rules specified by the owner.
          </p>
        )}
      </div>
    </div>
  );
};

export default AmenitiesAndRules;
