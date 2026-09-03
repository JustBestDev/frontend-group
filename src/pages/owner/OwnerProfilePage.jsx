import { BadgeCheck, Pencil, Save, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../stores/authStore.js";
import useOwnerStore from "../../stores/ownerStore.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  birthdate: "",
  gender: "",
  occupation: "",
  currentAddress: "",
  bio: ""
};

const fieldClass = "grid gap-1.5 text-xs text-muted-copy";
const inputClass = "w-full rounded-[10px] border border-line bg-cream px-3 py-2.5 text-ink outline-none transition focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10 disabled:cursor-default disabled:opacity-100";

const toProfileForm = (profile = {}) => {
  profile ??= {}; //ถ้าเป็น null หรือ undifined ให้เป็น object ว่าง
  return Object.fromEntries(
    Object.keys(emptyForm).map((key) => [
      key,
      key === "birthdate"
        ? profile[key]?.slice(0, 10) || ""
        : profile[key] || "",
    ]),
  );
};


const OwnerProfilePage = () => {
  const user = useAuthStore((state) => state.user) || {};
  const { profile, profileLoading, profileError, getMyProfile, updateMyProfile, } = useOwnerStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const successTimer = useRef(null);

  useEffect(() => {
    getMyProfile().catch(() => { });
    if (successTimer.current) window.clearTimeout(successTimer.current);
  }, []);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value || null]));
    try {
      await updateMyProfile(payload);
      setEditing(false);
      setSaved(true);
      if (successTimer.current) window.clearTimeout(successTimer.current);
      successTimer.current = window.setTimeout(() => setSaved(false), 2500);
    }
    catch { /* The store exposes the API error in the page alert. */ }
  };

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || user.username || "Owner";
  const completion = profile ? Math.round(["firstName", "lastName", "phone", "birthdate", "occupation", "currentAddress", "bio"].filter((key) => profile[key]).length / 7 * 100) : 0;
  const displayedForm = editing ? form : toProfileForm(profile);

  return <section className="mx-auto w-full max-w-330">
    <header className="mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-sage-dark">Owner portal</p><h1 className="m-0 font-serif text-[clamp(32px,4vw,44px)] leading-tight text-ink">Profile</h1><p className="mt-2 text-muted-copy">Manage your personal details and account information.</p>
      </div>
      {!editing &&
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-4.5 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => { setForm(toProfileForm(profile)); setEditing(true); }}
          disabled={!profile || profileLoading}><Pencil size={17} aria-hidden="true" />{profileLoading ? "Loading..." : "Edit profile"}</button>}
    </header>
    {profileError &&
      <p className="mb-4 rounded-xl bg-[#fde8e6] px-3.5 py-3 text-danger"
        role="alert">{profileError}
      </p>
    }
    {saved &&
      <p className="mb-4 rounded-xl bg-[#e5f2e5] px-3.5 py-3 text-[#47724f]"
        role="status">Profile updated successfully.
      </p>
    }
    <div
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_5px_16px_rgba(50,66,54,.05)]">
      <div className="flex items-center gap-4 border-b border-line p-6 max-md:flex-col max-md:items-stretch">
        {profile?.profileImageUrl ?
          <img className="size-17.5 shrink-0 rounded-full object-cover" src={profile.profileImageUrl} alt={`${fullName} profile`} />
          :
          <span className="grid size-17.5 shrink-0 place-items-center rounded-full bg-sage-dark text-white">
            <UserRound size={30} aria-hidden="true" />
          </span>
        }
        <div>
          <h2 className="m-0 font-serif text-2xl text-ink">{fullName}</h2>
          <p className="my-1 text-muted-copy">{user.email || user.username}</p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sage-dark">
            <BadgeCheck size={16} aria-hidden="true" />
            {profile?.isVerified ? "Verified profile" : "Owner account"}
          </span>
        </div>
        <div className="ml-auto w-full max-w-65 max-md:ml-0">
          <span className="mb-2 flex justify-between text-xs text-muted-copy">Profile completion <strong>{completion}%</strong>
          </span>
          <div className="h-1.75 overflow-hidden rounded-full bg-[#eeece4]" role="progressbar" aria-label="Profile completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completion}>
            <i className="block h-full bg-sage-dark" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
      {profileLoading && !profile ?
        <div
          className="grid min-h-72.5 place-content-center justify-items-center p-8 text-center text-muted-copy">
          Loading profile...
        </div> :
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4.25 max-md:grid-cols-1">
            <label className={fieldClass}>
              <span>First name</span>
              <input
                name="firstName"
                className={inputClass}
                value={displayedForm?.firstName}
                onChange={updateField} disabled={!editing} />
            </label>
            <label className={fieldClass}>
              <span>Last name</span>
              <input
                name="lastName"
                className={inputClass}
                value={displayedForm?.lastName}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className={fieldClass}>
              <span>Phone number</span>
              <input
                name="phone"
                className={inputClass}
                value={displayedForm?.phone}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className={fieldClass}>
              <span>Date of birth</span>
              <input
                type="date"
                name="birthdate"
                className={inputClass}
                value={displayedForm?.birthdate}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className={fieldClass}>
              <span>Gender</span>
              <select
                name="gender"
                className={inputClass}
                value={displayedForm?.gender}
                onChange={updateField}
                disabled={!editing}>
                <option value="">Not specified</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            <label className={fieldClass}>
              <span>Occupation</span>
              <input
                name="occupation"
                className={inputClass}
                value={displayedForm?.occupation}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className={`${fieldClass} col-span-full max-md:col-span-1`}>
              <span>Current address</span>
              <input
                name="currentAddress"
                className={inputClass}
                value={displayedForm?.currentAddress}
                onChange={updateField}
                disabled={!editing} />
            </label>
            <label className={`${fieldClass} col-span-full max-md:col-span-1`}>
              <span>Bio</span>
              <textarea
                rows="4"
                name="bio"
                className={`${inputClass} resize-y`}
                value={displayedForm?.bio}
                onChange={updateField}
                disabled={!editing} />
            </label>
          </div>
          {editing &&
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-transparent px-4.5 py-3 font-bold text-ink hover:bg-sage-light"
                onClick={() => {
                  setEditing(false); setForm(toProfileForm(profile));
                }}><X size={17} aria-hidden="true" />Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-4.5 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={profileLoading}>
                <Save size={17} aria-hidden="true" />
                {profileLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          }
        </form>}
    </div>
  </section>;
};
export default OwnerProfilePage;


