import { BedDouble, Building2, CheckCircle2, Clock3, Eye, MapPin, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { deletePropertyApi } from "../../services/ownerApi.js";
import useOwnerStore from "../../stores/ownerStore.js";

const filters = ["ALL", "APPROVED", "PENDING", "REJECTED"];

const OwnerPropertiesPage = () => {
  const { properties, isLoading, error, getMyProperties } = useOwnerStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => { getMyProperties().catch(() => {}); }, [getMyProperties]);

  const counts = useMemo(() => ({
    total: properties.length,
    approved: properties.filter((item) => item.publishStatus === "APPROVED").length,
    pending: properties.filter((item) => item.publishStatus === "PENDING").length,
    rooms: properties.reduce((sum, item) => sum + (item.rooms?.length || 0), 0),
  }), [properties]);
  const visibleProperties = useMemo(() => properties.filter((property) => {
    const location = [property.address?.district, property.address?.province].filter(Boolean).join(" ");
    const searchText = `${property.title} ${location}`.toLowerCase();
    return (filter === "ALL" || property.publishStatus === filter) && searchText.includes(query.trim().toLowerCase());
  }), [filter, properties, query]);

  const closeDeleteModal = () => { if (!deleting) { setPropertyToDelete(null); setDeleteError(""); } };
  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleting(true); setDeleteError("");
    try { await deletePropertyApi(propertyToDelete.id); await getMyProperties(); setPropertyToDelete(null); }
    catch (requestError) { setDeleteError(requestError.response?.data?.message || "Unable to delete property"); }
    finally { setDeleting(false); }
  };

  return <section className="mx-auto w-full max-w-7xl pb-12">
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="owner-eyebrow">Your portfolio</p><h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">My Properties</h1><p className="mt-2 text-muted-copy">Manage listings, rooms, and approval status in one place.</p></div>
      <Link to="/owner/properties/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-3 font-bold text-white shadow-[0_8px_20px_rgba(189,124,73,.22)] transition hover:-translate-y-0.5 hover:brightness-95"><Plus size={18}/> Add property</Link>
    </header>

    <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[{label:"All properties",value:counts.total,icon:Building2,tone:"bg-sage-light text-sage-dark"},{label:"Approved",value:counts.approved,icon:CheckCircle2,tone:"bg-[#e5f2e5] text-[#47724f]"},{label:"Pending review",value:counts.pending,icon:Clock3,tone:"bg-[#fff1d2] text-[#8d681e]"},{label:"Rooms added",value:counts.rooms,icon:BedDouble,tone:"bg-terracotta-light text-terracotta"}].map(({label,value,icon:Icon,tone}) => <article key={label} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_6px_20px_rgba(50,66,54,.05)] md:p-5"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={21}/></span><div><strong className="font-serif text-2xl text-ink">{value}</strong><p className="text-xs text-muted-copy md:text-sm">{label}</p></div></article>)}
    </div>

    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-3 shadow-[0_6px_20px_rgba(50,66,54,.04)] md:flex-row md:items-center md:justify-between">
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-cream px-4"><Search size={18} className="shrink-0 text-muted-copy"/><span className="sr-only">Search properties</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by property name or location..." className="w-full border-0 bg-transparent py-3 text-sm text-ink outline-none"/></label>
      <div className="flex gap-1 overflow-x-auto" aria-label="Filter properties">{filters.map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold capitalize transition ${filter === item ? "bg-sage-dark text-white shadow-sm" : "bg-transparent text-muted-copy hover:bg-sage-light hover:text-sage-dark"}`}>{item === "ALL" ? "All" : item.toLowerCase()} <span className="ml-1 text-xs opacity-70">{item === "ALL" ? counts.total : properties.filter((property) => property.publishStatus === item).length}</span></button>)}</div>
    </div>

    {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-danger" role="alert">{error}</p>}
    {isLoading ? <div className="mt-6 grid min-h-80 place-content-center justify-items-center rounded-3xl border border-line bg-white text-muted-copy"><Building2 className="mb-3 animate-pulse" size={38}/><p>Loading your properties...</p></div> : visibleProperties.length === 0 ? <div className="mt-6 grid min-h-80 place-content-center justify-items-center rounded-3xl border-2 border-dashed border-line bg-white/60 p-8 text-center"><span className="grid size-16 place-items-center rounded-2xl bg-sage-light text-sage-dark"><Building2 size={32}/></span><h2 className="mt-4 font-serif text-2xl text-ink">{properties.length ? "No matching properties" : "Build your property portfolio"}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-copy">{properties.length ? "Try another search term or select a different status." : "Create your first property, submit it for review, then add rooms from its detail page."}</p>{!properties.length && <Link to="/owner/properties/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-terracotta px-5 py-3 font-bold text-white"><Plus size={17}/> Create property</Link>}</div> :
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleProperties.map((property) => {
        const cover = property.images?.find((image) => image.isCover) || property.images?.[0];
        const address = [property.address?.district, property.address?.province].filter(Boolean).join(", ");
        const roomCount = property.rooms?.length || 0;
        const roomLimit = property.totalBedrooms || 0;
        const roomProgress = roomLimit ? Math.min(100, (roomCount / roomLimit) * 100) : 0;
        return <article key={property.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_8px_28px_rgba(50,66,54,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(50,66,54,.13)]">
          <Link to={`/owner/properties/${property.id}`} className="relative block h-52 shrink-0 overflow-hidden bg-sage-light sm:h-56">{cover?.imageUrl ? <img src={cover.imageUrl} alt={property.title} loading="lazy" className="block size-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.04]"/> : <div className="grid size-full place-items-center bg-linear-to-br from-sage-light to-[#d8e2d5] text-sage-dark"><Building2 size={44}/><span className="sr-only">No property image</span></div>}<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/5"/><span className={`owner-status status-${property.publishStatus?.toLowerCase()} absolute right-3 top-3 bg-white/95 shadow-sm sm:right-4 sm:top-4`}>{property.publishStatus}</span><div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/80">{property.propertyType?.replaceAll("_", " ")}</p><h2 className="mt-1 line-clamp-2 font-serif text-[22px] leading-tight sm:text-2xl">{property.title}</h2></div></Link>
          <div className="flex flex-1 flex-col p-5"><p className="flex min-h-5 items-center gap-2 text-sm text-muted-copy"><MapPin size={15} className="shrink-0 text-terracotta"/><span className="line-clamp-1">{address || "Address not added"}</span></p><div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-xs text-muted-copy">Monthly rent</p><strong className="mt-1 block text-xl text-terracotta">฿{Number(property.monthlyRent || 0).toLocaleString()}<span className="text-xs font-normal text-muted-copy"> / month</span></strong></div><span className="rounded-lg bg-cream px-2.5 py-1.5 text-xs font-bold text-ink">{property.propertyStatus}</span></div>
            <div className="mt-5 rounded-xl bg-cream p-3"><div className="flex items-center justify-between text-xs"><span className="inline-flex items-center gap-1.5 font-semibold text-muted-copy"><BedDouble size={15}/> Rooms</span><strong>{roomCount} / {roomLimit}</strong></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e5e2d8]"><div className="h-full rounded-full bg-sage-dark" style={{width:`${roomProgress}%`}}/></div></div>
            <div className="mt-auto grid grid-cols-[1fr_1fr_auto] gap-2 pt-5"><Link to={`/owner/properties/${property.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sage-dark px-3 py-2.5 text-sm font-bold text-white transition hover:brightness-95"><Eye size={15}/> Details</Link><Link to={`/owner/properties/${property.id}/edit`} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-sm font-bold text-ink transition hover:border-sage hover:bg-sage-light"><Pencil size={15}/> Edit</Link><button type="button" onClick={() => { setPropertyToDelete(property); setDeleteError(""); }} aria-label={`Delete ${property.title}`} className="grid size-10.5 place-items-center rounded-xl border border-red-100 bg-red-50 text-danger transition hover:bg-red-100"><Trash2 size={16}/></button></div>
          </div>
        </article>;
      })}</div>}

    {propertyToDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-[#14251d]/55 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDeleteModal(); }}><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-property-title"><div className="flex items-start justify-between gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-danger"><Trash2 size={22}/></span><button type="button" onClick={closeDeleteModal} disabled={deleting} aria-label="Close delete confirmation" className="grid size-9 place-items-center rounded-full bg-cream text-muted-copy hover:bg-gray-100"><X size={19}/></button></div><h2 id="delete-property-title" className="mt-5 font-serif text-3xl text-ink">Delete property?</h2><p className="mt-2 leading-6 text-muted-copy">You&apos;re about to delete <strong className="text-ink">{propertyToDelete.title}</strong>. It will be removed from your portfolio and public listings.</p>{deleteError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-danger" role="alert">{deleteError}</p>}<div className="mt-7 grid grid-cols-2 gap-3"><button type="button" onClick={closeDeleteModal} disabled={deleting} className="rounded-xl border border-line bg-white px-4 py-3 font-bold text-ink disabled:opacity-50">Keep property</button><button type="button" onClick={confirmDelete} disabled={deleting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 font-bold text-white disabled:opacity-50"><Trash2 size={16}/>{deleting ? "Deleting..." : "Delete"}</button></div></div></div>}
  </section>;
};

export default OwnerPropertiesPage;
