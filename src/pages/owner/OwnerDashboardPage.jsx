import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  Headphones,
  Image,
  MapPin,
  Plus,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router";
import useAuthStore from "../../stores/authStore.js";

const OwnerDashboard = () => {
  const user = useAuthStore((state) => state.user) || {};

  const displayName = user.profile?.firstName || user.username || "Owner";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const steps = [
    { label: "Complete profile", completed: true },
    { label: "Add property details", current: true },
    { label: "Add rooms & photos" },
    { label: "Submit for review" },
  ];

  return (
    <section className="owner-dashboard mx-auto w-full max-w-330">
      <header className="owner-page-header mb-6 flex items-start justify-between gap-6 max-[680px]:flex-col">
        <div><p className="owner-eyebrow">Owner portal</p><h1>Welcome, {displayName}</h1>
          <p>Your owner account is approved. Let&apos;s publish your first property.</p></div>
        <div className="owner-account flex items-center gap-3">
          <button type="button" aria-label="Notifications (coming soon)" title="Notifications coming soon" disabled>
            <Bell size={20} aria-hidden="true" />
          </button>
          <span aria-label={`${displayName}'s profile`}>{initials}</span></div>
      </header>

      <div className="owner-approved-banner mb-4.5 flex items-center gap-4 rounded-2xl border border-[#cbd8c5] bg-[#f0f5ec] px-5.5 py-5">
        <span><Check size={24} /></span>
        <div><h2>You&apos;re now a verified owner</h2>
          <p>Start by creating your first property listing.</p>
        </div>
      </div>

      <div className="owner-onboarding-grid grid grid-cols-[minmax(0,1.6fr)_minmax(280px,.75fr)] gap-4.5 max-[1050px]:grid-cols-1">
        <article className="owner-setup-card rounded-[19px] border border-line bg-surface p-6 shadow-[0_14px_35px_rgba(50,66,54,.08)]">
          <h2>Set up your first listing</h2>
          <ol className="owner-steps relative my-7 grid list-none grid-cols-4 gap-2 p-0 max-[680px]:grid-cols-1" aria-label="Listing setup progress">
            {steps.map((step, index) => (
              <li className={`owner-step ${step.completed ? "completed" : ""} ${step.current ? "current" : ""}`} key={step.label}>
                <span>{step.completed ? <Check size={18} aria-hidden="true" /> : index + 1}</span><strong>{step.label}</strong>
              </li>
            ))}
          </ol>
          <div className="owner-progress flex items-center gap-3" role="progressbar" aria-label="Listing setup progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25">
            <span><i /></span><strong>25%</strong>
          </div>
          <div className="owner-setup-actions mt-6 flex items-center gap-5 border-t border-line pt-5 max-[680px]:flex-col max-[680px]:items-stretch">
            <Link className="owner-primary-button inline-flex items-center gap-2 rounded-xl bg-terracotta px-4.5 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              to="/owner/properties/new"><Plus size={18} />Add your first property
            </Link>
            <a className="owner-text-button inline-flex font-bold text-terracotta hover:underline"
              href="#listing-requirements">
              View listing requirements
            </a>
          </div>
        </article>

        <aside className="owner-side-stack grid gap-3.5 max-[1050px]:grid-cols-2 max-[680px]:grid-cols-1">
          <article className="owner-checklist-card scroll-mt-6 rounded-[19px] border border-line bg-surface p-6 shadow-[0_14px_35px_rgba(50,66,54,.08)]" id="listing-requirements">
            <h2>Before you publish</h2>
            <ul>
              <li><MapPin size={17} />Property address</li>
              <li><ScrollText size={17} />Rental details</li>
              <li><Image size={17} />At least 3 clear photos</li>
              <li><Building2 size={17} />Room information</li>
            </ul>
          </article>
          <article className="owner-support-card flex items-center gap-3.5 rounded-[19px] border border-line bg-surface p-4.5 shadow-[0_14px_35px_rgba(50,66,54,.08)]">
            <span><Headphones size={23} /></span>
            <div>
              <h3>Need help?</h3>
              <p>Contact RoomShare support.</p>
              <Link to="/owner/messages">Contact support
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </aside>
      </div>

      <section className="owner-properties-section mt-6">
        <h2>Your properties</h2>
        <div className="owner-empty-properties flex items-center gap-5 rounded-[19px] border border-line bg-surface px-7 py-6 shadow-[0_14px_35px_rgba(50,66,54,.08)] max-[680px]:flex-col max-[680px]:items-stretch">
          <span><Building2 size={38} />
          </span>
          <div>
            <h3>No properties yet</h3>
            <p>Create your first listing to start finding tenants.</p>
          </div>
          <Link to="/owner/properties/new">Create property</Link>
        </div>
      </section>
    </section>
  );
};

export default OwnerDashboard;

