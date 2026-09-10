import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getApiErrorMessage } from "../../services/api.js";
import {
  getAmenitiesApi,
  getHouseRulesApi,
} from "../../services/ownerApi.js";
import { propertyOptionIcons } from "../../utils/propertyOptions.js";

const optionClass =
  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold text-ink transition focus-within:ring-2 focus-within:ring-sage-dark focus-within:ring-offset-2";

const PropertyOptionsFields = ({
  amenityIds,
  houseRules,
  onAmenityIdsChange,
  onHouseRulesChange,
}) => {
  const [amenities, setAmenities] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getAmenitiesApi(), getHouseRulesApi()])
      .then(([amenityResponse, ruleResponse]) => {
        if (!active) return;
        setAmenities(amenityResponse.data || []);
        setRules(ruleResponse.data || []);
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError, "Unable to load property options"));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleAmenity = (amenityId) => {
    onAmenityIdsChange(
      amenityIds.includes(amenityId)
        ? amenityIds.filter((id) => id !== amenityId)
        : [...amenityIds, amenityId],
    );
  };

  const toggleRule = (rule) => {
    const selected = houseRules.some(({ houseRuleId }) => houseRuleId === rule.id);
    onHouseRulesChange(
      selected
        ? houseRules.filter(({ houseRuleId }) => houseRuleId !== rule.id)
        : [
            ...houseRules,
            {
              houseRuleId: rule.id,
              code: rule.code,
              ...(rule.code === "QUIET_HOURS"
                ? { startTime: "22:00", endTime: "07:00" }
                : {}),
            },
          ],
    );
  };

  const quietHours = houseRules.find(({ code }) => code === "QUIET_HOURS");

  return (
    <section
      className="grid gap-7 border-t border-line pt-7 md:col-span-2"
      aria-label="Property options"
    >
      {loading && <p className="text-sm text-muted-copy">Loading amenities and house rules...</p>}
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-danger" role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <fieldset>
            <legend className="font-serif text-2xl text-ink">Amenities</legend>
            <p className="mt-1 text-sm text-muted-copy">Select everything available at this property.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((amenity) => {
                const Icon = propertyOptionIcons[amenity.code];
                const selected = amenityIds.includes(amenity.id);
                return (
                  <label
                    className={`${optionClass} ${selected ? "border-sage-dark bg-sage-light" : "border-line bg-white hover:bg-cream"}`}
                    key={amenity.id}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected}
                      onChange={() => toggleAmenity(amenity.id)}
                    />
                    {Icon && <Icon size={19} className="shrink-0 text-sage-dark" aria-hidden="true" />}
                    <span className="min-w-0">{amenity.name}</span>
                    {selected && (
                      <span className="ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-forest text-white">
                        <Check size={13} strokeWidth={3} aria-hidden="true" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="border-t border-line pt-7">
            <legend className="font-serif text-2xl text-ink">House Rules</legend>
            <p className="mt-1 text-sm text-muted-copy">Choose the rules that apply to tenants.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rules.map((rule) => {
                const Icon = propertyOptionIcons[rule.code];
                const selected = houseRules.some(({ houseRuleId }) => houseRuleId === rule.id);
                return (
                  <label
                    className={`${optionClass} ${selected ? "border-sage-dark bg-sage-light" : "border-line bg-white hover:bg-cream"}`}
                    key={rule.id}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected}
                      onChange={() => toggleRule(rule)}
                    />
                    {Icon && <Icon size={19} className="shrink-0 text-sage-dark" aria-hidden="true" />}
                    <span className="min-w-0">{rule.name}</span>
                    {selected && (
                      <span className="ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-forest text-white">
                        <Check size={13} strokeWidth={3} aria-hidden="true" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {quietHours && (
            <fieldset className="max-w-xl rounded-xl border border-line bg-cream p-4">
              <legend className="px-1 text-sm font-semibold text-ink">Quiet hours</legend>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                {[ ["startTime", "From"], ["endTime", "To"] ].map(([field, label], index) => (
                  <div className="contents" key={field}>
                    {index === 1 && (
                      <span className="hidden pb-3 text-sm text-muted-copy sm:block" aria-hidden="true">to</span>
                    )}
                    <label className="grid gap-1.5 text-sm font-semibold text-ink">
                      {label}
                      <input
                        required
                        type="time"
                        value={quietHours[field] || ""}
                        onChange={(event) =>
                          onHouseRulesChange(
                            houseRules.map((rule) =>
                              rule.code === "QUIET_HOURS"
                                ? { ...rule, [field]: event.target.value }
                                : rule,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          )}
        </>
      )}
    </section>
  );
};

export default PropertyOptionsFields;
