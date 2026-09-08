import { Bell, Building2, Check, ChevronRight, Headphones, Image, MapPin, Plus, ScrollText } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import useAuthStore from "../../stores/authStore.js";
import useOwnerStore from "../../stores/ownerStore.js";

const OwnerDashboard = () => {
  const user = useAuthStore((state) => state.user) || {};
  const { properties, isLoading, error, getMyProperties } = useOwnerStore();
  useEffect(() => { getMyProperties().catch(() => {}); }, [getMyProperties]);

  const displayName = user.profile?.firstName || user.username || "Owner";
  const initials = displayName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const firstProperty = properties[0];
  const setupState = {
    details: Boolean(firstProperty),
    address: Boolean(firstProperty?.address),
    photos: Boolean(firstProperty?.images?.length),
  };
  const steps = [
    { label: "Property details", completed: setupState.details },
    { label: "Property address", completed: setupState.address },
    { label: "Photos & submit", completed: setupState.photos },
  ];
  const completedCount = steps.filter((step) => step.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);
  const currentIndex = completedCount >= steps.length ? -1 : completedCount;
  const actionPath = firstProperty ? `/owner/properties/${firstProperty.id}` : "/owner/properties/new";
  const actionLabel = firstProperty ? (progress === 100 ? "Manage property & rooms" : "Continue property setup") : "Create your first property";

  return <section className="owner-dashboard mx-auto w-full max-w-330">
    <header className="owner-page-header mb-6 flex items-start justify-between gap-6 max-[680px]:flex-col">
      <div><p className="owner-eyebrow">Owner portal</p><h1>Welcome, {displayName}</h1><p>{properties.length ? "Manage your properties and rooms from one place." : "Create your first property listing in three simple steps."}</p></div>
      <div className="owner-account flex items-center gap-3"><button type="button" aria-label="Notifications (coming soon)" title="Notifications coming soon" disabled><Bell size={20}/></button><span aria-label={`${displayName}'s profile`}>{initials}</span></div>
    </header>

    <div className="owner-approved-banner mb-4.5 flex items-center gap-4 rounded-2xl border border-[#cbd8c5] bg-[#f0f5ec] px-5.5 py-5"><span><Check size={24}/></span><div><h2>You&apos;re a verified owner</h2><p>{properties.length ? "Your owner tools are ready to use." : "Start by creating your first property listing."}</p></div></div>

    {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-danger" role="alert">{error}</p>}
    <div className="owner-onboarding-grid grid grid-cols-[minmax(0,1.6fr)_minmax(280px,.75fr)] gap-4.5 max-[1050px]:grid-cols-1">
      <article className="owner-setup-card rounded-[19px] border border-line bg-surface p-6 shadow-[0_14px_35px_rgba(50,66,54,.08)]">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="owner-eyebrow">Property setup</p><h2>{progress === 100 ? "Your listing is ready" : "Create a property in 3 steps"}</h2></div>{firstProperty && <span className={`owner-status status-${firstProperty.publishStatus?.toLowerCase()}`}>{firstProperty.publishStatus}</span>}</div>
        <ol className="owner-steps relative my-7 grid list-none grid-cols-3 gap-2 p-0 max-[680px]:grid-cols-1" aria-label="Property setup progress">
          {steps.map((step, index) => <li className={`owner-step ${step.completed ? "completed" : ""} ${index === currentIndex ? "current" : ""}`} key={step.label}><span>{step.completed ? <Check size={18}/> : index + 1}</span><strong>{step.label}</strong></li>)}
        </ol>
        <div className="owner-progress flex items-center gap-3" role="progressbar" aria-label="Property setup progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span><i style={{ width: `${progress}%` }}/></span><strong>{progress}%</strong></div>
        <div className="owner-setup-actions mt-6 flex items-center gap-5 border-t border-line pt-5 max-[680px]:flex-col max-[680px]:items-stretch"><Link className="owner-primary-button inline-flex items-center gap-2" to={actionPath}><Plus size={18}/>{actionLabel}</Link><Link className="owner-text-button" to="/owner/properties">View all properties</Link></div>
        {progress === 100 && <p className="mt-4 rounded-xl bg-sage-light/60 p-3 text-sm text-sage-dark"><strong>Next:</strong> Open the property details page to add rooms. Rooms can be added up to the Total bedrooms limit.</p>}
      </article>

      <aside className="owner-side-stack grid gap-3.5 max-[1050px]:grid-cols-2 max-[680px]:grid-cols-1">
        <article className="owner-checklist-card scroll-mt-6" id="listing-requirements"><h2>Property requirements</h2><ul><li><ScrollText size={17}/>Property and rental details</li><li><MapPin size={17}/>Complete property address</li><li><Image size={17}/>At least 1 property photo</li><li><Building2 size={17}/>Set the total bedroom limit</li></ul><p className="mt-5 border-t border-line pt-4 text-xs leading-5 text-muted-copy">Room information is added later from the Property Detail page.</p></article>
        <article className="owner-support-card"><span><Headphones size={23}/></span><div><h3>Need help?</h3><p>Chat directly with an administrator.</p><Link to="/owner/messages">Contact support <ChevronRight size={15}/></Link></div></article>
      </aside>
    </div>

    <section className="owner-properties-section mt-6"><div className="mb-3 flex items-end justify-between gap-4"><h2>Your properties</h2>{properties.length > 0 && <Link to="/owner/properties" className="text-sm font-bold text-terracotta">View all</Link>}</div>
      {isLoading ? <div className="grid min-h-32 place-items-center rounded-2xl border border-line bg-white text-muted-copy">Loading properties...</div> : properties.length === 0 ? <div className="owner-empty-properties"><span><Building2 size={38}/></span><div><h3>No properties yet</h3><p>Create your first listing to start finding tenants.</p></div><Link to="/owner/properties/new">Create property</Link></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{properties.slice(0, 3).map((property) => { const cover = property.images?.find((item) => item.isCover) || property.images?.[0]; return <Link key={property.id} to={`/owner/properties/${property.id}`} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_25px_rgba(50,66,54,.06)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(50,66,54,.12)]">{cover ? <img src={cover.imageUrl} alt={property.title} className="h-40 w-full object-cover"/> : <div className="grid h-40 place-items-center bg-sage-light text-sage-dark"><Building2 size={38}/></div>}<div className="p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-serif text-xl">{property.title}</h3><span className={`owner-status status-${property.publishStatus?.toLowerCase()}`}>{property.publishStatus}</span></div><p className="mt-2 text-sm text-muted-copy">{property.rooms?.length || 0} / {property.totalBedrooms || 0} rooms added</p></div></Link>; })}</div>}
    </section>
  </section>;
};

export default OwnerDashboard;
