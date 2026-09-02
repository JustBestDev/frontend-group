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

const OwnerDashboard = () => {
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch { user = {}; }

  const displayName = user.profile?.firstName || user.username || "Owner";
  const initials = displayName.slice(0, 2).toUpperCase();

  const steps = [
    { label: "Complete profile", completed: true },
    { label: "Add property details", current: true },
    { label: "Add rooms & photos" },
    { label: "Submit for review" },
  ];

  return (
    <section className="owner-dashboard">
      <header className="owner-page-header">
        <div><p className="owner-eyebrow">Owner portal</p><h1>Welcome, {displayName}</h1>
          <p>Your owner account is approved. Let&apos;s publish your first property.</p></div>
        <div className="owner-account"><button type="button" aria-label="Notifications"><Bell size={20} /></button>
          <span>{initials}</span></div>
      </header>

      <div className="owner-approved-banner">
        <span><Check size={24} /></span><div><h2>You&apos;re now a verified owner</h2>
          <p>Start by creating your first property listing.</p></div>
      </div>

      <div className="owner-onboarding-grid">
        <article className="owner-setup-card">
          <h2>Set up your first listing</h2>
          <div className="owner-steps">
            {steps.map((step, index) => (
              <div className={`owner-step ${step.completed ? "completed" : ""} ${step.current ? "current" : ""}`} key={step.label}>
                <span>{step.completed ? <Check size={18} /> : index + 1}</span><strong>{step.label}</strong>
              </div>
            ))}
          </div>
          <div className="owner-progress"><span><i /></span><strong>25%</strong></div>
          <div className="owner-setup-actions">
            <Link className="owner-primary-button" to="/owner/properties/new"><Plus size={18} />Add your first property</Link>
            <button type="button" className="owner-text-button">View listing requirements</button>
          </div>
        </article>

        <aside className="owner-side-stack">
          <article className="owner-checklist-card"><h2>Before you publish</h2>
            <ul><li><MapPin size={17} />Property address</li><li><ScrollText size={17} />Rental details</li>
              <li><Image size={17} />At least 3 clear photos</li><li><Building2 size={17} />Room information</li></ul>
          </article>
          <article className="owner-support-card"><span><Headphones size={23} /></span><div><h3>Need help?</h3>
            <p>Contact RoomShare support.</p><button type="button">Contact support <ChevronRight size={15} /></button></div></article>
        </aside>
      </div>

      <section className="owner-properties-section"><h2>Your properties</h2>
        <div className="owner-empty-properties"><span><Building2 size={38} /></span><div><h3>No properties yet</h3>
          <p>Create your first listing to start finding tenants.</p></div>
          <Link to="/owner/properties/new">Create property</Link></div>
      </section>
    </section>
  );
};

export default OwnerDashboard;
