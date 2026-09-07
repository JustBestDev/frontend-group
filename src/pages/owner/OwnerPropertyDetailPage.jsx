import { ArrowLeft, Building2, MapPin, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import {
  createPropertyAddressApi,
  getOwnerPropertyApi,
  updatePropertyAddressApi,
  updatePropertyApi,
} from "../../services/ownerApi.js";

const inputClass = "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10";
const labelClass = "grid gap-1.5 text-sm font-semibold text-ink";
const propertyFields = ["title", "description", "propertyType", "rentType", "monthlyRent", "deposit", "availableDate", "totalBedrooms"];
const addressFields = ["province", "district", "subDistrict", "postcode", "road", "building"];

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
          availableDate: data.availableDate ? data.availableDate.slice(0, 10) : "",
          ...Object.fromEntries(addressFields.map((field) => [field, data.address?.[field] || ""])),
        });
      })
      .catch((requestError) => active && setError(requestError.response?.data?.message || "Unable to load property"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [propertyId]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const details = Object.fromEntries(propertyFields.map((field) => [field, form[field]]));
      details.monthlyRent = Number(details.monthlyRent);
      details.deposit = details.deposit === "" ? null : Number(details.deposit);
      details.totalBedrooms = details.totalBedrooms === "" || details.totalBedrooms == null ? null : Number(details.totalBedrooms);
      details.availableDate = details.availableDate || null;
      const address = Object.fromEntries(addressFields.map((field) => [field, form[field] || null]));
      address.province = form.province;
      await updatePropertyApi(propertyId, details);
      if (property.address) await updatePropertyAddressApi(propertyId, address);
      else await createPropertyAddressApi(propertyId, address);
      navigate(`/owner/properties/${propertyId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="grid min-h-72 place-items-center text-muted-copy">Loading property...</div>;
  if (!property) return <div className="rounded-xl bg-red-50 p-4 text-danger">{error || "Property not found"}</div>;

  const cover = property.images?.find((image) => image.isCover) || property.images?.[0];
  if (!editing) return (
    <section className="mx-auto w-full max-w-6xl pb-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link to="/owner/properties" className="inline-flex items-center gap-2 text-sm font-bold text-sage-dark"><ArrowLeft size={16} /> My Properties</Link>
        <Link to="edit" className="inline-flex items-center gap-2 rounded-xl bg-sage-dark px-4 py-3 font-bold text-white"><Pencil size={17} /> Edit property</Link>
      </div>
      {cover ? <img src={cover.imageUrl} alt={property.title} className="h-72 w-full rounded-2xl object-cover md:h-96" /> : <div className="grid h-72 place-items-center rounded-2xl bg-sage-light"><Building2 size={54} /></div>}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <article className="rounded-2xl border border-line bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><h1 className="font-serif text-4xl text-ink">{property.title}</h1><span className="rounded-full bg-sage-light px-3 py-1 text-sm font-bold text-sage-dark">{property.publishStatus}</span></div>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-muted-copy">{property.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><p><strong>Type:</strong> {property.propertyType}</p><p><strong>Rent type:</strong> {property.rentType}</p><p><strong>Monthly rent:</strong> ฿{Number(property.monthlyRent).toLocaleString()}</p><p><strong>Deposit:</strong> {property.deposit == null ? "-" : `฿${Number(property.deposit).toLocaleString()}`}</p><p><strong>Bedrooms:</strong> {property.totalBedrooms ?? "-"}</p><p><strong>Status:</strong> {property.propertyStatus}</p></div>
        </article>
        <aside className="grid content-start gap-5">
          <div className="rounded-2xl border border-line bg-white p-5"><h2 className="flex items-center gap-2 font-serif text-2xl"><MapPin size={20} /> Address</h2><p className="mt-3 leading-6 text-muted-copy">{[property.address?.building, property.address?.road, property.address?.subDistrict, property.address?.district, property.address?.province, property.address?.postcode].filter(Boolean).join(", ") || "No address"}</p></div>
          <div className="rounded-2xl border border-line bg-white p-5"><h2 className="font-serif text-2xl">Rooms ({property.rooms?.length || 0})</h2>{property.rooms?.length ? <ul className="mt-3 grid gap-2">{property.rooms.map((room) => <li key={room.id} className="rounded-lg bg-cream p-3"><strong>{room.roomName}</strong><br/><span className="text-sm text-muted-copy">฿{Number(room.monthlyRent).toLocaleString()}/month · {room.status}</span></li>)}</ul> : <p className="mt-2 text-muted-copy">No rooms added.</p>}</div>
        </aside>
      </div>
    </section>
  );

  return (
    <section className="mx-auto w-full max-w-5xl pb-10">
      <Link to={`/owner/properties/${propertyId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"><ArrowLeft size={16} /> Property details</Link>
      <h1 className="font-serif text-4xl text-ink">Edit property</h1>
      <p className="mt-2 text-muted-copy">Saving changes will send the listing back for admin approval.</p>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-danger">{error}</p>}
      <form onSubmit={save} className="mt-6 grid gap-5 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
        <label className={labelClass}>Title<input required name="title" value={form.title || ""} onChange={change} className={inputClass} /></label>
        <label className={labelClass}>Property type<select name="propertyType" value={form.propertyType || "CONDO"} onChange={change} className={inputClass}>{["HOUSE","CONDO","APARTMENT","DORMITORY","OTHER"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className={`${labelClass} md:col-span-2`}>Description<textarea required rows="5" name="description" value={form.description || ""} onChange={change} className={inputClass} /></label>
        <label className={labelClass}>Rent type<select name="rentType" value={form.rentType || "WHOLE_UNIT"} onChange={change} className={inputClass}><option value="WHOLE_UNIT">Whole unit</option><option value="INDIVIDUAL_ROOM">Individual rooms</option></select></label>
        <label className={labelClass}>Monthly rent<input required min="0" type="number" name="monthlyRent" value={form.monthlyRent ?? ""} onChange={change} className={inputClass} /></label>
        <label className={labelClass}>Deposit<input min="0" type="number" name="deposit" value={form.deposit ?? ""} onChange={change} className={inputClass} /></label>
        <label className={labelClass}>Bedrooms<input min="0" type="number" name="totalBedrooms" value={form.totalBedrooms ?? ""} onChange={change} className={inputClass} /></label>
        <label className={labelClass}>Available date<input type="date" name="availableDate" value={form.availableDate || ""} onChange={change} className={inputClass} /></label>
        <h2 className="mt-3 font-serif text-2xl md:col-span-2">Address</h2>
        {addressFields.map((field) => <label key={field} className={labelClass}>{field.replace(/([A-Z])/g, " $1")}<input required={field === "province"} name={field} value={form[field] || ""} onChange={change} className={inputClass} /></label>)}
        <div className="flex justify-end gap-3 md:col-span-2"><Link to={`/owner/properties/${propertyId}`} className="rounded-xl border border-line px-5 py-3 font-bold">Cancel</Link><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-5 py-3 font-bold text-white disabled:opacity-50"><Save size={17} />{saving ? "Saving..." : "Save changes"}</button></div>
      </form>
    </section>
  );
};

export default OwnerPropertyDetailPage;
