import { ArrowLeft, Camera, Save } from "lucide-react";
import { useEffect, useState } from "react";
import useImagePreview from "../../hooks/useImagePreview.js";
import { Link, useNavigate, useParams } from "react-router";
import { getRoomApi, replaceRoomImageApi, updateRoomApi } from "../../services/ownerApi.js";

const inputClass = "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10";
const labelClass = "grid gap-1.5 text-sm font-semibold text-ink";

export default function OwnerEditRoomPage() {
  const { propertyId, roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({ roomName: "", description: "", monthlyRent: "", status: "AVAILABLE", capacity: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const previewUrl = useImagePreview(imageFile);


  useEffect(() => {
    let active = true;
    getRoomApi(roomId).then((data) => {
      if (!active) return;
      setRoom(data);
      setForm({ roomName: data.roomName || "", description: data.description || "", monthlyRent: Number(data.monthlyRent), status: data.status || "AVAILABLE", capacity: data.capacity ?? "" });
    }).catch((requestError) => active && setError(requestError.response?.data?.message || "Unable to load room")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [roomId]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const changeImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return setError("Choose a JPEG, PNG, WebP, or GIF image");
    }
    if (file.size > 5 * 1024 * 1024) return setError("Room image must not exceed 5 MB");
    setImageFile(file);
    setError("");
  };
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateRoomApi(roomId, { roomName: form.roomName.trim(), description: form.description.trim() || undefined, monthlyRent: Number(form.monthlyRent), status: form.status, capacity: form.capacity === "" ? undefined : Number(form.capacity) });
      if (imageFile) await replaceRoomImageApi(roomId, imageFile);
      navigate(`/owner/properties/${propertyId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update room");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="grid min-h-72 place-items-center text-muted-copy">Loading room...</div>;
  if (!room) return <div className="rounded-xl bg-red-50 p-4 text-danger">{error || "Room not found"}</div>;
  return <section className="mx-auto w-full max-w-4xl pb-10">
    <Link to={`/owner/properties/${propertyId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"><ArrowLeft size={16}/> Property details</Link>
    <h1 className="font-serif text-4xl text-ink">Edit room</h1><p className="mt-2 text-muted-copy">Update room information. The property will return to pending review.</p>
    {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-danger" role="alert">{error}</p>}
    <form onSubmit={submit} className="mt-6 grid gap-5 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <div className="relative overflow-hidden rounded-2xl bg-sage-light">
          {previewUrl || room.images?.[0]?.imageUrl ? <img src={previewUrl || room.images[0].imageUrl} alt="Room preview" className="h-64 w-full object-cover object-center md:h-80"/> : <div className="grid h-64 place-items-center text-muted-copy md:h-80">No room photo</div>}
          <label className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-lg transition hover:bg-sage-light"><Camera size={17}/>{imageFile ? "Choose another" : "Change photo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={changeImage}/></label>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-copy"><span>One image · JPEG, PNG, WebP, or GIF · Maximum 5 MB</span>{imageFile && <button type="button" onClick={() => { setImageFile(null); }} className="font-bold text-danger">Use current photo</button>}</div>
      </div>
      <label className={labelClass}>Room title<input required maxLength="100" name="roomName" value={form.roomName} onChange={change} className={inputClass}/></label>
      <label className={labelClass}>Monthly rent<input required min="0" step="0.01" type="number" name="monthlyRent" value={form.monthlyRent} onChange={change} className={inputClass}/></label>
      <label className={`${labelClass} md:col-span-2`}>Description<textarea maxLength="500" rows="4" name="description" value={form.description} onChange={change} className={inputClass}/></label>
      <label className={labelClass}>Status<select name="status" value={form.status} onChange={change} className={inputClass}><option value="AVAILABLE">Available</option><option value="RESERVED">Reserved</option><option value="RENTED">Rented</option></select></label>
      <label className={labelClass}>Maximum residents<input min="1" type="number" name="capacity" value={form.capacity} onChange={change} className={inputClass}/></label>
      <div className="flex justify-end gap-3 md:col-span-2"><Link to={`/owner/properties/${propertyId}`} className="rounded-xl border border-line px-5 py-3 font-bold">Cancel</Link><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-5 py-3 font-bold text-white disabled:opacity-50"><Save size={17}/>{saving ? "Saving..." : "Save changes"}</button></div>
    </form>
  </section>;
}
