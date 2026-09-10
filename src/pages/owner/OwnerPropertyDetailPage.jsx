import {
  ArrowLeft,
  Banknote,
  BedDouble,
  Building2,
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Save,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import PropertyImageLightbox from "../../components/owner/PropertyImageLightbox.jsx";
import PropertyOptionsFields from "../../components/owner/PropertyOptionsFields.jsx";
import {
  createPropertyAddressApi,
  getOwnerPropertyApi,
  updatePropertyAddressApi,
  updatePropertyApi,
} from "../../services/ownerApi.js";
import {
  hasValidQuietHours,
  parseQuietHours,
  propertyOptionIcons,
  toHouseRulesPayload,
} from "../../utils/propertyOptions.js";
import { imagePreviewReducer } from "../../utils/imagePreview.js";
import {
  ownerEditRoomPath,
  ownerRoomPath,
} from "../../utils/ownerRoutes.js";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10";
const labelClass = "grid gap-1.5 text-sm font-semibold text-ink";

const propertyFields = [
  "title",
  "description",
  "propertyType",
  "rentType",
  "monthlyRent",
  "deposit",
  "availableDate",
  "totalBedrooms",
];

const addressFields = [
  "province",
  "district",
  "subDistrict",
  "postcode",
  "road",
  "building",
];

const OwnerPropertyDetailPage = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editing = location.pathname.endsWith("/edit");

  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewIndex, dispatchPreview] = useReducer(
    imagePreviewReducer,
    null,
  );
  const imageCount = property?.images?.length || 0;
  const closePreview = useCallback(
    () => dispatchPreview({ type: "close" }),
    [],
  );
  const nextPreview = useCallback(
    () => dispatchPreview({ type: "next", total: imageCount }),
    [imageCount],
  );
  const previousPreview = useCallback(
    () => dispatchPreview({ type: "previous", total: imageCount }),
    [imageCount],
  );

  useEffect(() => {
    let active = true;

    getOwnerPropertyApi(propertyId)
      .then(({ data }) => {
        if (!active) return;

        setProperty(data);
        setForm({
          ...data,
          monthlyRent: Number(data.monthlyRent),
          deposit: data.deposit == null ? "" : Number(data.deposit),
          availableDate: data.availableDate
            ? data.availableDate.slice(0, 10)
            : "",
          amenityIds: (data.amenities || []).map(({ id }) => id),
          houseRules: (data.houseRules || []).map(({ id, code, value }) => ({
            houseRuleId: id,
            code,
            ...(code === "QUIET_HOURS" ? parseQuietHours(value) : {}),
          })),
          ...Object.fromEntries(
            addressFields.map((field) => [
              field,
              data.address?.[field] || "",
            ]),
          ),
        });
      })
      .catch((requestError) => {
        if (!active) return;

        setError(
          requestError.response?.data?.message || "Unable to load property",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [propertyId]);

  const change = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!hasValidQuietHours(form.houseRules || [])) {
        setError("Quiet hours must use the format 22:00-07:00");
        return;
      }

      const details = Object.fromEntries(
        propertyFields.map((field) => [field, form[field]]),
      );

      details.monthlyRent = Number(details.monthlyRent);
      details.deposit = details.deposit === "" ? null : Number(details.deposit);
      details.totalBedrooms =
        details.totalBedrooms === "" || details.totalBedrooms == null
          ? null
          : Number(details.totalBedrooms);
      details.availableDate = details.availableDate || null;
      details.amenityIds = form.amenityIds || [];
      details.houseRules = toHouseRulesPayload(form.houseRules || []);

      const address = Object.fromEntries(
        addressFields.map((field) => [field, form[field] || null]),
      );
      address.province = form.province;

      const { data: updatedProperty } = await updatePropertyApi(
        propertyId,
        details,
      );

      let addressResponse;
      if (property.address) {
        addressResponse = await updatePropertyAddressApi(propertyId, address);
      } else {
        addressResponse = await createPropertyAddressApi(propertyId, address);
      }

      setProperty({ ...updatedProperty, address: addressResponse.data });
      navigate(`/owner/properties/${propertyId}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save property",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-72 place-items-center text-muted-copy">
        Loading property...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-danger">
        {error || "Property not found"}
      </div>
    );
  }

  const cover =
    property.images?.find((image) => image.isCover) || property.images?.[0];
  const coverIndex = cover ? property.images.indexOf(cover) : -1;

  if (!editing) {
    const summaryItems = [
      {
        icon: Banknote,
        label: "Monthly rent",
        value: `฿${Number(property.monthlyRent).toLocaleString()}`,
      },
      {
        icon: Banknote,
        label: "Deposit",
        value:
          property.deposit == null
            ? "Not specified"
            : `฿${Number(property.deposit).toLocaleString()}`,
      },
      {
        icon: BedDouble,
        label: "Bedrooms",
        value: property.totalBedrooms ?? "-",
      },
      {
        icon: CalendarDays,
        label: "Status",
        value: property.propertyStatus,
      },
      {
        icon: CalendarDays,
        label: "Available from",
        value: property.availableDate
          ? new Date(property.availableDate).toLocaleDateString()
          : "Not specified",
      },
    ];

    const propertyAddress = [
      property.address?.building,
      property.address?.road,
      property.address?.subDistrict,
      property.address?.district,
      property.address?.province,
      property.address?.postcode,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <section className="mx-auto w-full max-w-7xl pb-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/owner/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-sage-dark transition hover:text-ink"
          >
            <ArrowLeft size={17} />
            Back to My Properties
          </Link>

          <Link
            to="edit"
            className="inline-flex items-center gap-2 rounded-xl border border-sage-dark bg-white px-4 py-2.5 font-bold text-sage-dark transition hover:bg-sage-light"
          >
            <Pencil size={17} />
            Edit property
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-sage-light shadow-[0_18px_50px_rgba(50,66,54,.12)]">
          {cover ? (
            <button
              type="button"
              onClick={() => dispatchPreview({ type: "open", index: coverIndex })}
              aria-label={`Open ${property.title} image preview`}
              className="block w-full cursor-zoom-in focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
            >
              <img
                src={cover.imageUrl}
                alt={`${property.title} cover`}
                className="h-72 w-full object-cover sm:h-96 lg:h-112"
              />
            </button>
          ) : (
            <div className="grid h-72 place-items-center text-sage-dark sm:h-96">
              <Building2 size={64} />
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/65 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white md:p-8">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[.18em] text-white/75">
                {property.propertyType?.replaceAll("_", " ")}
              </p>
              <h1 className="font-serif text-4xl leading-tight md:text-5xl">
                {property.title}
              </h1>
            </div>

            <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-extrabold text-sage-dark shadow-sm">
              {property.publishStatus}
            </span>
          </div>

          {imageCount > 1 && (
            <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              View all {imageCount} photos
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,.7fr)]">
          <article className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_25px_rgba(50,66,54,.05)] md:p-8">
            <h2 className="font-serif text-2xl text-ink">
              About this property
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-copy">
              {property.description}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
              {summaryItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl bg-cream p-4">
                  <Icon size={19} className="text-terracotta" />
                  <p className="mt-3 text-xs font-semibold text-muted-copy">
                    {label}
                  </p>
                  <strong className="mt-1 block text-sm text-ink">
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            {property.amenities?.length > 0 && (
              <div className="mt-7 border-t border-line pt-6">
                <h3 className="font-serif text-xl text-ink">Amenities</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => {
                    const Icon = propertyOptionIcons[amenity.code];
                    return (
                      <li
                        key={amenity.id}
                        className="inline-flex items-center gap-2 rounded-full bg-sage-light px-3 py-1.5 text-sm font-semibold text-sage-dark"
                      >
                        {Icon && <Icon size={18} className="shrink-0" aria-hidden="true" />}
                        {amenity.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {property.houseRules?.length > 0 && (
              <div className="mt-7 border-t border-line pt-6">
                <h3 className="font-serif text-xl text-ink">House Rules</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {property.houseRules.map((rule) => {
                    const Icon = propertyOptionIcons[rule.code];
                    return (
                      <li key={rule.id} className="flex items-center gap-2 rounded-xl bg-cream p-3 text-sm text-ink">
                        {Icon && <Icon size={18} className="shrink-0 text-sage-dark" aria-hidden="true" />}
                        <span>{rule.name}{rule.value ? `: ${rule.value}` : ""}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </article>

          <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_25px_rgba(50,66,54,.05)]">
            <span className="grid size-11 place-items-center rounded-full bg-sage-light text-sage-dark">
              <MapPin size={21} />
            </span>

            <h2 className="mt-4 font-serif text-2xl">Property address</h2>

            <p className="mt-3 leading-7 text-muted-copy">
              {propertyAddress || "No address has been added."}
            </p>

            <div className="mt-5 border-t border-line pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-copy">
                Rent type
              </p>
              <strong className="mt-1 block text-sm">
                {property.rentType?.replaceAll("_", " ")}
              </strong>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-3xl border border-line bg-white p-5 shadow-[0_10px_30px_rgba(50,66,54,.06)] md:p-8">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-terracotta">
                Room management
              </p>
              <h2 className="mt-1 font-serif text-3xl text-ink">Rooms</h2>
              <p className="mt-1 text-sm text-muted-copy">
                {property.rooms?.length || 0} of {property.totalBedrooms || 0} rooms
                have been added
              </p>
            </div>

            {property.totalBedrooms &&
              property.rooms.length < property.totalBedrooms && (
                <Link
                  to="rooms/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-5 py-3 font-bold text-white shadow-sm transition hover:brightness-95"
                >
                  <Plus size={18} />
                  Add room
                </Link>
              )}
          </header>

          {property.rooms?.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {property.rooms.map((room) => (
                <article
                  key={room.id}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(50,66,54,.12)]"
                >
                  <div className="relative overflow-hidden">
                    {room.images?.[0] ? (
                      <img
                        src={room.images[0].imageUrl}
                        alt={room.roomName}
                        className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-52 place-items-center bg-sage-light text-sage-dark">
                        <BedDouble size={42} />
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-sm ${
                        room.status === "AVAILABLE"
                          ? "bg-white text-[#47724f]"
                          : room.status === "RESERVED"
                            ? "bg-[#fff1d2] text-[#8d681e]"
                            : "bg-[#f2e2d5] text-[#805b37]"
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-ink">
                      {room.roomName}
                    </h3>

                    {room.description && (
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-copy">
                        {room.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                      <div>
                        <strong className="text-lg text-terracotta">
                          ฿{Number(room.monthlyRent).toLocaleString()}
                        </strong>
                        <span className="text-xs text-muted-copy"> / month</span>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-copy">
                        <Users size={15} />
                        {room.capacity || "-"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        to={ownerRoomPath(property.id, room.id)}
                        state={{
                          backTo: `/owner/properties/${property.id}`,
                          backLabel: "Back to Property",
                        }}
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-sage-dark px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark"
                      >
                        View room
                      </Link>
                      <Link
                        to={ownerEditRoomPath(property.id, room.id)}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-sage-dark px-4 py-2.5 text-sm font-bold text-sage-dark transition hover:bg-sage-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark"
                      >
                        <Pencil size={15} />
                        Edit room
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid min-h-52 place-content-center justify-items-center rounded-2xl border-2 border-dashed border-line bg-cream/50 p-8 text-center">
              <BedDouble size={38} className="text-sage-dark" />
              <h3 className="mt-3 font-serif text-xl">No rooms yet</h3>
              <p className="mt-1 text-sm text-muted-copy">
                Add the first room to this property.
              </p>
            </div>
          )}

          {(!property.totalBedrooms ||
            property.rooms.length >= property.totalBedrooms) && (
            <p className="mt-6 rounded-xl bg-[#eeece4] p-3 text-center text-sm font-bold text-muted-copy">
              {property.totalBedrooms
                ? "All room slots have been filled"
                : "Set total bedrooms before adding rooms"}
            </p>
          )}
        </section>
        {previewIndex != null && (
          <PropertyImageLightbox
            images={property.images}
            index={previewIndex}
            propertyTitle={property.title}
            onClose={closePreview}
            onNext={nextPreview}
            onPrevious={previousPreview}
          />
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl pb-10">
      <Link
        to={`/owner/properties/${propertyId}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
      >
        <ArrowLeft size={16} />
        Property details
      </Link>

      <h1 className="font-serif text-4xl text-ink">Edit property</h1>

      <p className="mt-2 text-muted-copy">
        Saving changes will send the listing back for admin approval.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-danger">{error}</p>
      )}

      <form
        onSubmit={save}
        className="mt-6 grid gap-5 rounded-2xl border border-line bg-white p-6 md:grid-cols-2"
      >
        <label className={labelClass}>
          Title
          <input
            required
            name="title"
            value={form.title || ""}
            onChange={change}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Property type
          <select
            name="propertyType"
            value={form.propertyType || "CONDO"}
            onChange={change}
            className={inputClass}
          >
            {["HOUSE", "CONDO", "APARTMENT", "DORMITORY", "OTHER"].map(
              (value) => (
                <option key={value}>{value}</option>
              ),
            )}
          </select>
        </label>

        <label className={`${labelClass} md:col-span-2`}>
          Description
          <textarea
            required
            rows="5"
            name="description"
            value={form.description || ""}
            onChange={change}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Rent type
          <select
            name="rentType"
            value={form.rentType || "WHOLE_UNIT"}
            onChange={change}
            className={inputClass}
          >
            <option value="WHOLE_UNIT">Whole unit</option>
            <option value="INDIVIDUAL_ROOM">Individual rooms</option>
          </select>
        </label>

        <label className={labelClass}>
          Monthly rent
          <input
            required
            min="0"
            type="number"
            name="monthlyRent"
            value={form.monthlyRent ?? ""}
            onChange={change}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Deposit
          <input
            min="0"
            type="number"
            name="deposit"
            value={form.deposit ?? ""}
            onChange={change}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Bedrooms
          <input
            required
            min={Math.max(1, property.rooms?.length || 0)}
            type="number"
            name="totalBedrooms"
            value={form.totalBedrooms ?? ""}
            onChange={change}
            className={inputClass}
          />
          <small className="font-normal text-muted-copy">
            Cannot be lower than existing rooms ({property.rooms?.length || 0}).
          </small>
        </label>

        <label className={labelClass}>
          Available date
          <input
            type="date"
            name="availableDate"
            value={form.availableDate || ""}
            onChange={change}
            className={inputClass}
          />
        </label>

        <PropertyOptionsFields
          amenityIds={form.amenityIds || []}
          houseRules={form.houseRules || []}
          onAmenityIdsChange={(amenityIds) =>
            setForm((current) => ({ ...current, amenityIds }))
          }
          onHouseRulesChange={(houseRules) =>
            setForm((current) => ({ ...current, houseRules }))
          }
        />

        <h2 className="mt-3 font-serif text-2xl md:col-span-2">Address</h2>

        {addressFields.map((field) => (
          <label key={field} className={labelClass}>
            {field.replace(/([A-Z])/g, " $1")}
            <input
              required={field === "province"}
              name={field}
              value={form[field] || ""}
              onChange={change}
              className={inputClass}
            />
          </label>
        ))}

        <div className="flex justify-end gap-3 md:col-span-2">
          <Link
            to={`/owner/properties/${propertyId}`}
            className="rounded-xl border border-line px-5 py-3 font-bold"
          >
            Cancel
          </Link>

          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-5 py-3 font-bold text-white disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default OwnerPropertyDetailPage;
