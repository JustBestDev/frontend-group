import { BadgeCheck, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/profileService.js";

const UserProfileModal = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const handleKeyDown = (event) => event.key === "Escape" && onClose();

    getUserProfile(userId)
      .then((data) => active && setProfile(data))
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message || "Unable to retrieve profile",
          );
        }
      });

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      active = false;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, userId]);

  const displayName = profile && (profile.firstName || profile.user.username);

  return (
    <div
      className="fixed inset-0 z-[1100] grid place-items-center overflow-y-auto bg-black/65 p-5 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-label="User profile"
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_90px_rgba(19,25,20,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 z-10 grid size-9 cursor-pointer place-items-center rounded-lg border-0 bg-white/90 text-ink transition hover:bg-sage-light"
        >
          <X size={20} />
        </button>

        {error ? (
          <p className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-danger" role="alert">
            {error}
          </p>
        ) : !profile ? (
          <div className="grid min-h-64 place-items-center text-muted-copy">Loading profile...</div>
        ) : (
          <>
            <header className="flex items-center gap-5 border-b border-line p-6 sm:p-8">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={`${displayName}'s profile`}
                  className="size-20 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid size-20 shrink-0 place-items-center rounded-full bg-sage-dark text-white">
                  <UserRound size={34} aria-hidden="true" />
                </span>
              )}
              <div>
                <h1 className="m-0 font-serif text-3xl text-ink">{displayName}</h1>
                <p className="mt-1 text-muted-copy">@{profile.user.username}</p>
                {profile.isVerified && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-sage-dark">
                    <BadgeCheck size={16} aria-hidden="true" />
                    Verified profile
                  </span>
                )}
              </div>
            </header>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <section className="sm:col-span-2">
                <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-sage-dark">About</h2>
                <p className="leading-relaxed text-ink">{profile.bio || "No bio provided."}</p>
              </section>
              <section>
                <h2 className="mb-1 text-sm font-bold text-muted-copy">Occupation</h2>
                <p className="text-ink">{profile.occupation || "Not provided"}</p>
              </section>
              <section>
                <h2 className="mb-1 text-sm font-bold text-muted-copy">Gender</h2>
                <p className="text-ink">{profile.gender || "Not provided"}</p>
              </section>
            </div>
          </>
        )}
      </article>
    </div>
  );
};

export default UserProfileModal;
