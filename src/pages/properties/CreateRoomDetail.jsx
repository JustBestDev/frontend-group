import { useEffect, useMemo, useState } from "react";
import { Banknote, CheckCircle2, DoorOpen, ImagePlus, Trash2, UploadCloud, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { createPropertyRoomApi, deleteRoomApi, getOwnerPropertyApi, uploadRoomImagesApi } from "../../services/ownerApi.js";
import "../../styles/pages/createRoomDetail.css";

const initialForm = { roomName: "", description: "", monthlyRent: "", status: "AVAILABLE", capacity: "" };

export default function CreateRoomDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const previews = useMemo(() => images.map((file) => ({ file, url: URL.createObjectURL(file) })), [images]);

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);
  useEffect(() => {
    let active = true;
    getOwnerPropertyApi(propertyId).then(({ data }) => active && setProperty(data)).catch((requestError) => active && setError(requestError.response?.data?.message || "Unable to load property")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [propertyId]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const addImages = (fileList) => {
    const selected = Array.from(fileList).find((file) => file.type.startsWith("image/"));
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) return setError(`${selected.name} exceeds 5 MB`);
    setImages([selected]);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.roomName.trim()) return setError("Room title is required");
    if (!form.monthlyRent || Number(form.monthlyRent) < 0) return setError("Enter a valid monthly rent");
    if (images.length !== 1) return setError("Upload one room photo");
    setSubmitting(true);
    setError("");
    let roomId = null;
    try {
      const created = await createPropertyRoomApi(propertyId, { roomName: form.roomName.trim(), description: form.description.trim() || undefined, monthlyRent: Number(form.monthlyRent), status: form.status, capacity: form.capacity === "" ? undefined : Number(form.capacity) });
      roomId = created.data.id;
      await uploadRoomImagesApi(roomId, images[0]);
      navigate(`/owner/properties/${propertyId}`);
    } catch (requestError) {
      if (roomId) await deleteRoomApi(roomId).catch(() => {});
      setError(requestError.response?.data?.message || "Unable to add room");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="grid min-h-72 place-items-center text-muted-copy">Loading property...</div>;
  if (!property) return <div className="rounded-xl bg-red-50 p-4 text-danger">{error || "Property not found"}</div>;
  const roomCount = property.rooms?.length || 0;
  const atLimit = !property.totalBedrooms || roomCount >= property.totalBedrooms;
  if (atLimit) return <section className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center"><DoorOpen className="mx-auto text-muted-copy" size={42}/><h1 className="mt-4 font-serif text-3xl">{property.totalBedrooms ? "Room limit reached" : "Total bedrooms required"}</h1><p className="mt-2 text-muted-copy">This property currently has {roomCount} of {property.totalBedrooms || 0} rooms.</p><Link to={`/owner/properties/${propertyId}`} className="mt-6 inline-flex rounded-xl bg-sage-dark px-5 py-3 font-bold text-white">Back to property</Link></section>;

  return <form className="create-room-page" onSubmit={submit}><div className="add-room-page">
    <div className="add-room-header"><div><h1>Add Room</h1><p>{property.title} · Room {roomCount + 1} of {property.totalBedrooms}</p></div><Link className="back-button" to={`/owner/properties/${propertyId}`}>← Back to the Unit</Link></div>
    {error && <p className="mx-auto mb-5 max-w-320 rounded-xl bg-red-50 p-3 text-danger" role="alert">{error}</p>}
    <section className="room-section"><div className="section-header"><div className="section-icon"><DoorOpen size={27}/></div><h2>1. Room Information</h2></div><div className="section-divider"/><div className="section-form two-columns">
      <div className="form-group"><label>Room Title <span>*</span></label><input name="roomName" maxLength="100" value={form.roomName} onChange={update} placeholder="Example: Room A1"/><div className="form-helper"><span>Name the room so tenants can distinguish it.</span><span>{form.roomName.length} / 100</span></div></div>
      <div className="form-group"><label>Room Description <small>(Optional)</small></label><textarea name="description" maxLength="500" value={form.description} onChange={update} placeholder="Describe the room, features and layout."/><div className="form-helper"><span>Add more details about this room.</span><span>{form.description.length} / 500</span></div></div>
    </div></section>
    <section className="room-section"><div className="section-header"><div className="section-icon"><Banknote size={27}/></div><h2>2. Rental Information & Status</h2></div><div className="section-divider"/><div className="section-form two-columns">
      <div className="form-group"><label>Monthly Rent <span>*</span></label><div className="price-input"><div className="price-prefix">฿</div><input name="monthlyRent" type="number" min="0" step="0.01" value={form.monthlyRent} onChange={update}/><div className="price-suffix">/ Month</div></div></div>
      <div className="form-group"><label>Room Status <span>*</span></label><div className="room-status-options">{[["AVAILABLE","Available","This room is available for rent"],["RENTED","Rented","This room is currently occupied"]].map(([value,title,copy]) => <button key={value} type="button" className={`status-card ${form.status === value ? "active" : ""}`} onClick={() => setForm((current) => ({...current, status:value}))}><div><div className="status-title"><span className={`status-dot ${value.toLowerCase()}`}/><strong>{title}</strong></div><p>{copy}</p></div>{form.status === value && <CheckCircle2 className="status-check" size={24}/>}</button>)}</div></div>
    </div></section>
    <section className="room-section"><div className="section-header"><div className="section-icon"><Users size={27}/></div><h2>3. Number of Residents</h2></div><div className="section-divider"/><div className="form-group guest-group"><label>Max. Resident <small>(Optional)</small></label><div className="guest-input"><input name="capacity" type="number" min="1" value={form.capacity} onChange={update} placeholder="Example: 1"/><div className="guest-suffix">Person</div></div></div></section>
    <section className="room-section image-section"><div className="section-header"><div className="section-icon"><ImagePlus size={27}/></div><h2>4. Room Photo</h2></div><div className="section-divider"/><p className="image-description">Upload 1 JPG, PNG, WebP or GIF image, maximum 5 MB.</p><label className="upload-box"><UploadCloud size={36} className="upload-icon"/><strong>Click to choose a room photo</strong><span>{images.length} / 1 selected</span><input type="file" accept="image/*" className="sr-only" onChange={(event) => addImages(event.target.files)}/></label>
      <div className="preview-area"><h4>Photo preview</h4><div className="preview-grid">{previews.map(({file,url}, index) => <div className="relative" key={`${file.name}-${file.lastModified}`}><img src={url} alt="" className="h-36 w-full rounded-lg object-cover"/>{index === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-forest px-2 py-1 text-xs text-white">Cover</span>}<button type="button" aria-label={`Remove ${file.name}`} onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border-0 bg-white text-danger"><Trash2 size={15}/></button></div>)}</div></div>
    </section>
    <div className="add-room-footer"><Link className="cancel-button" to={`/owner/properties/${propertyId}`}>Cancel</Link><button className="submit-button" disabled={submitting}>{submitting ? "Adding room..." : "Add Room"}</button></div>
  </div></form>;
}
