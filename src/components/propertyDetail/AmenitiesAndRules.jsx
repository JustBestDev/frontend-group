import { CircleCheck } from "lucide-react";
import { propertyOptionIcons } from "../../utils/propertyOptions.js";

const AmenitiesAndRules = ({ property }) => (
  <div className="space-y-9">
    <section className="rounded-[20px] bg-white p-6 shadow-[0_10px_28px_rgba(50,66,54,.06)] sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-forest sm:text-3xl">About this property</h2>
      {property.description ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-copy">{property.description}</p> : <p className="mt-4 text-sm text-muted-copy">No description provided.</p>}
    </section>

    <section>
      <h2 className="font-serif text-2xl font-bold text-forest sm:text-3xl">Amenities</h2>
      {property.amenities?.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {property.amenities.map((amenity) => {
            const Icon = propertyOptionIcons[amenity.code] || CircleCheck;
            return <div key={amenity.id} className="flex min-h-15 items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-[0_8px_22px_rgba(50,66,54,.05)]"><Icon className="size-5 shrink-0 text-sage-dark" aria-hidden="true" /><span>{amenity.name}</span></div>;
          })}
        </div>
      ) : <p className="mt-3 text-sm text-muted-copy">No amenities listed.</p>}
    </section>

    <section>
      <h2 className="font-serif text-2xl font-bold text-forest sm:text-3xl">House Rules</h2>
      {property.houseRules?.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {property.houseRules.map((rule) => {
            const Icon = propertyOptionIcons[rule.code] || CircleCheck;
            return (
              <div key={rule.id} className="flex min-h-18 items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_8px_22px_rgba(50,66,54,.05)]">
                <Icon className="mt-0.5 size-5 shrink-0 text-sage-dark" aria-hidden="true" />
                <span className="text-sm"><strong className="block text-forest">{rule.name}</strong>{rule.value && <span className="mt-0.5 block text-xs text-muted-copy">{rule.value}</span>}</span>
              </div>
            );
          })}
        </div>
      ) : <p className="mt-3 text-sm text-muted-copy">No house rules listed.</p>}
    </section>
  </div>
);

export default AmenitiesAndRules;
