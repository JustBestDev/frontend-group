import { BadgeCheck, BriefcaseBusiness, CalendarDays, Camera, Mail, MapPin, Pencil, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import EditProfileModal from "../../components/profile/EditProfileModal.jsx";
import useAuthStore from "../../stores/authStore.js";
import useOwnerStore from "../../stores/ownerStore.js";

const formatDate = (value) => value ? new Date(value).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" }) : "Not provided";

export default function OwnerProfilePage() {
  const user = useAuthStore((state) => state.user) || {};
  const { profile, profileLoading, profileError, getMyProfile } = useOwnerStore();
  const [editing, setEditing] = useState(false);
  useEffect(() => { getMyProfile().catch(() => { }); }, [getMyProfile]);

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || user.username || "Owner";
  const initials = fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const fields = ["firstName", "lastName", "phone", "birthdate", "gender", "occupation", "currentAddress", "bio"];
  const completion = profile ? Math.round(fields.filter((key) => profile[key]).length / fields.length * 100) : 0;
  const details = [
    { icon: Mail, label: "Email", value: user.email || "Not provided" },
    { icon: Phone, label: "Phone", value: profile?.phone || "Not provided" },
    { icon: CalendarDays, label: "Date of birth", value: formatDate(profile?.birthdate) },
    { icon: BriefcaseBusiness, label: "Occupation", value: profile?.occupation || "Not provided" },
    { icon: UserRound, label: "Gender", value: profile?.gender ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase() : "Not provided" },
    { icon: MapPin, label: "Current address", value: profile?.currentAddress || "Not provided" },
  ];
  const closeEditor = () => { setEditing(false); getMyProfile().catch(() => { }); };

  return <section className="mx-auto w-full max-w-6xl pb-12">
    <header><p className="owner-eyebrow">Account settings</p><h1 className="font-serif text-4xl text-ink md:text-5xl">Profile</h1><p className="mt-2 text-muted-copy">Your personal and owner account information.</p></header>
    {profileError && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-danger" role="alert">{profileError}</p>}
    {profileLoading && !profile ? <div className="mt-7 grid min-h-96 place-items-center rounded-3xl border border-line bg-white text-muted-copy">Loading profile...</div> : profile && <div className="mt-7 grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_12px_35px_rgba(50,66,54,.08)] lg:sticky lg:top-8">
        <div className="h-28 bg-linear-to-br from-[#29483a] to-sage-dark" />
        <div className="px-6 pb-7 text-center">
          <div
            className="relative mx-auto "
            style={{ width: 100, height: 100, marginTop: 70 }}
          >
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={fullName}
                className="block rounded-full border-4 border-white bg-white object-cover object-center shadow-md"
                style={{
                  width: 100,
                  height: 100,
                  minWidth: 100,
                  maxWidth: 100,
                  minHeight: 100,
                  maxHeight: 100,
                }}
              />
            ) : (
              <span
                className="grid place-items-center rounded-full border-4 border-white bg-sage-light font-serif text-3xl font-bold text-sage-dark shadow-md"
                style={{ width: 100, height: 100 }}
              >
                {initials}
              </span>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Change photo"
              className="absolute bottom-0 right-0 grid size-9 place-items-center rounded-full border-3 border-white bg-terracotta text-white shadow-sm transition hover:scale-105"
            >
              <Camera size={15} />
            </button>
          </div>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">{fullName}</h2>
          <p className="mt-1 text-sm text-muted-copy">@{user.username}</p>
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e8f0e5] px-3 py-1.5 text-xs font-bold text-[#527058]"><BadgeCheck size={15} />{profile.isVerified ? "Verified owner" : "Owner account"}</span>
            <button type="button" onClick={() => setEditing(true)} className="mt-6 inline-flex w-40 items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-3 font-bold text-white transition hover:brightness-95"><Pencil size={14} /> Edit profile</button>
          </div>
          <div className="m-6 border-t border-line pt-5 text-left">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-muted-copy">Profile completion</span><strong className="text-sage-dark">{completion}%</strong>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ebe9e0]">
              <div className="h-full rounded-full bg-sage-dark" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_12px_35px_rgba(50,66,54,.07)]">
        <section className="p-6 md:p-8"><div className="flex items-center justify-between gap-4 border-b border-line pb-5"><div><h2 className="font-serif text-2xl text-ink">Personal information</h2><p className="mt-1 text-sm text-muted-copy">Information associated with your RoomShare account.</p></div><button type="button" onClick={() => setEditing(true)} className="hidden items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-sage-dark hover:bg-sage-light sm:inline-flex"><Pencil size={15} /> Edit</button></div>
          <dl className="grid sm:grid-cols-2">{details.map(({ icon: Icon, label, value }, index) => <div key={label} className={`flex min-w-0 gap-4 py-5 ${index % 2 === 0 ? "sm:pr-6" : "sm:border-l sm:border-line sm:pl-6"} ${index < details.length - 2 ? "border-b border-line" : "max-sm:border-b max-sm:border-line"}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream text-sage-dark"><Icon size={18} /></span><div className="min-w-0"><dt className="text-xs font-semibold text-muted-copy">{label}</dt><dd className="mt-1 wrap-anywhere text-sm font-semibold leading-5 text-ink">{value}</dd></div></div>)}</dl>
        </section>
        <section className="border-t border-line bg-[#fcfbf7] p-6 md:p-8"><h2 className="font-serif text-2xl text-ink">About</h2><p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-muted-copy">{profile.bio || "No bio added yet. Add a short introduction to help tenants learn more about you."}</p>{!profile.bio && <button type="button" onClick={() => setEditing(true)} className="mt-3 text-sm font-bold text-terracotta">Add bio</button>}</section>
        <section className="flex flex-wrap items-center gap-4 border-t border-line p-6 md:px-8"><span className="grid size-11 place-items-center rounded-full bg-[#e8f0e5] text-[#527058]"><ShieldCheck size={20} /></span><div className="min-w-0 flex-1"><h3 className="font-serif text-lg text-ink">Owner account active</h3><p className="mt-0.5 text-xs text-muted-copy">You can publish properties and manage rooms and rentals.</p></div><strong className="rounded-full bg-[#e8f0e5] px-3 py-1.5 text-xs text-[#527058]">ACTIVE</strong></section>
      </main>
    </div>}
    <EditProfileModal isOpen={editing} onClose={closeEditor} />
  </section>;
}
