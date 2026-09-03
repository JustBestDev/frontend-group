import { BadgeCheck, Pencil, Save, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "../../stores/authStore.js";
import useOwnerStore from "../../stores/ownerStore.js";

const emptyForm = { firstName: "", lastName: "", phone: "", birthdate: "", gender: "", occupation: "", currentAddress: "", bio: "" };
const toProfileForm = (profile = {}) => Object.fromEntries(Object.keys(emptyForm).map((key) => [key, key === "birthdate" ? profile[key]?.slice(0, 10) || "" : profile[key] || ""]));
const OwnerProfilePage = () => {
  const user = useAuthStore((state) => state.user) || {};
  const { profile, isLoading, error, getMyProfile, updateMyProfile } = useOwnerStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  useEffect(() => { getMyProfile().catch(() => { }); }, [getMyProfile]);
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => { event.preventDefault(); const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value || null])); try { await updateMyProfile(payload); setEditing(false); setSaved(true); window.setTimeout(() => setSaved(false), 2500); } catch { /* The store exposes the API error in the page alert. */ } };
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || user.username || "Owner";
  const completion = profile ? Math.round(["firstName", "lastName", "phone", "birthdate", "occupation", "currentAddress", "bio"].filter((key) => profile[key]).length / 7 * 100) : 0;
  const displayedForm = editing ? form : toProfileForm(profile);
  return <section className="owner-resource-page mx-auto w-full max-w-330">
    <header className="owner-resource-header mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
      <div>
        <p className="owner-eyebrow">Owner portal</p><h1>Profile</h1><p>Manage your personal details and account information.</p>
      </div>
      {!editing &&
        <button
          className="owner-primary-button inline-flex items-center gap-2 rounded-xl bg-terracotta px-4.5 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => { setForm(toProfileForm(profile)); setEditing(true); }}
          disabled={!profile}><Pencil size={17} />Edit profile</button>}
    </header>
    {error &&
      <p className="owner-alert rounded-xl bg-[#fde8e6] px-3.5 py-3 text-danger"
        role="alert">{error}
      </p>
    }
    {saved &&
      <p className="owner-success rounded-xl bg-[#e5f2e5] px-3.5 py-3 text-[#47724f]"
        role="status">Profile updated successfully.
      </p>
    }
    <div
      className="owner-profile-card overflow-hidden rounded-xl border border-line bg-surface shadow-[0_5px_16px_rgba(50,66,54,.05)]">
      <div className="owner-profile-summary flex items-center gap-4 border-b border-line p-6 max-md:flex-col max-md:items-stretch">
        {profile?.profileImageUrl ?
          <img src={profile.profileImageUrl} alt={`${fullName} profile`} />
          :
          <span className="owner-profile-avatar grid size-17.5 shrink-0 place-items-center rounded-full bg-sage-dark text-white">
            <UserRound size={30} />
          </span>
        }
        <div>
          <h2>{fullName}</h2>
          <p>{user.email || user.username}</p>
          <span className="owner-verified">
            <BadgeCheck size={16} />
            {profile?.isVerified ? "Verified profile" : "Owner account"}
          </span>
        </div>
        <div className="owner-completion ml-auto w-full max-w-65 max-md:ml-0">
          <span>Profile completion <strong>{completion}%</strong>
          </span>
          <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completion}>
            <i style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
      {isLoading && !profile ?
        <div
          className="owner-loading grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy">
          Loading profile...
        </div> :
        <form className="owner-profile-form p-6" onSubmit={handleSubmit}>
          <div className="owner-form-grid grid grid-cols-2 gap-4.25 max-md:grid-cols-1">
            <label>
              <span>First name</span>
              <input
                name="firstName"
                value={displayedForm.firstName}
                onChange={updateField} disabled={!editing} />
            </label>
            <label>
              <span>Last name</span>
              <input
                name="lastName"
                value={displayedForm.lastName}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label>
              <span>Phone number</span>
              <input
                name="phone"
                value={displayedForm.phone}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label>
              <span>Date of birth</span>
              <input
                type="date"
                name="birthdate"
                value={displayedForm.birthdate}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label>
              <span>Gender</span>
              <select
                name="gender"
                value={displayedForm.gender}
                onChange={updateField}
                disabled={!editing}>
                <option value="">Not specified</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            <label>
              <span>Occupation</span>
              <input
                name="occupation"
                value={displayedForm.occupation}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className="full">
              <span>Current address</span>
              <input
                name="currentAddress"
                value={displayedForm.currentAddress}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className="full">
              <span>Bio</span>
              <textarea
                rows="4"
                name="bio"
                value={displayedForm.bio}
                onChange={updateField}
                disabled={!editing} />
            </label>
          </div>
          {editing &&
            <div className="owner-form-actions mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                className="owner-secondary-button inline-flex items-center gap-2 rounded-xl border border-line bg-transparent px-4.5 py-3 font-bold text-ink hover:bg-sage-light"
                onClick={() => {
                  setEditing(false); setForm(toProfileForm(profile));
                }}><X size={17} />Cancel
              </button>
              <button
                className="owner-primary-button inline-flex items-center gap-2 rounded-xl bg-terracotta px-4.5 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}>
                <Save size={17} />
                {isLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          }
        </form>}
    </div>
  </section>;
};
export default OwnerProfilePage;


