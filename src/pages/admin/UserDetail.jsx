import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";
import api from "../../services/api";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/admin/users/${userId}`
      );

      const userData =
        response.data.data?.user ||
        response.data.data ||
        response.data.user;

      setUser(userData || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to retrieve user"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#DCE5DF] border-t-forest" />

          <p className="mt-4 text-sm font-medium text-[#7D8981]">
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="rounded-2xl border border-[#E4E9E4] bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#EEF3EF] text-forest">
          <UserRound size={26} />
        </div>

        <h1 className="mt-4 text-xl font-bold text-[#26372E]">
          User unavailable
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm text-[#7B8780]">
          {error}
        </p>

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={fetchUser}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          <Link
            to="/admin/users"
            className="inline-flex h-10 items-center rounded-xl border border-[#DDE4DE] px-4 text-sm font-semibold text-[#536159]"
          >
            Back to users
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const profile = user.profile || {};

  const fullName =
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ") ||
    user.username ||
    "Unknown user";

  const getStatusClass = (status) => {
    if (status === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "SUSPENDED") {
      return "bg-amber-50 text-amber-700";
    }

    if (status === "BANNED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getRoleClass = (role) => {
    if (role === "ADMIN") {
      return "bg-violet-50 text-violet-700";
    }

    if (role === "OWNER") {
      return "bg-sky-50 text-sky-700";
    }

    return "bg-[#EEF3EF] text-[#355244]";
  };

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#647168] transition hover:text-forest"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="flex items-center gap-4">
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={fullName}
              className="size-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-2xl bg-[#EAF0EC] text-xl font-bold text-forest">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829087]">
              User detail
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#1E2F27]">
              {fullName}
            </h1>

            <p className="mt-1 text-sm text-[#7B8780]">
              @{user.username || "unknown"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getRoleClass(
              user.role || "USER"
            )}`}
          >
            {user.role || "USER"}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
              user.status || "ACTIVE"
            )}`}
          >
            {user.status || "ACTIVE"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {/* Account information */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Account information
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  User account and membership details
                </p>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
              <InfoItem
                label="Username"
                value={user.username || "—"}
              />

              <InfoItem
                label="Email"
                value={user.email || "—"}
                icon={<Mail size={15} />}
              />

              <InfoItem
                label="Role"
                value={user.role || "USER"}
                icon={<ShieldCheck size={15} />}
              />

              <InfoItem
                label="Status"
                value={user.status || "ACTIVE"}
                icon={<CheckCircle2 size={15} />}
              />

              <InfoItem
                label="Joined"
                value={
                  user.createdAt
                    ? new Date(
                      user.createdAt
                    ).toLocaleString()
                    : "—"
                }
                icon={<CalendarDays size={15} />}
              />

              <InfoItem
                label="Last updated"
                value={
                  user.updatedAt
                    ? new Date(
                      user.updatedAt
                    ).toLocaleString()
                    : "—"
                }
              />
            </div>
          </section>

          {/* Profile */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Profile information
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  Personal information provided by the user
                </p>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
              <InfoItem
                label="First name"
                value={profile.firstName || "—"}
              />

              <InfoItem
                label="Last name"
                value={profile.lastName || "—"}
              />

              <InfoItem
                label="Phone"
                value={profile.phone || "—"}
                icon={<Phone size={15} />}
              />

              <InfoItem
                label="Gender"
                value={profile.gender || "—"}
              />

              <InfoItem
                label="Occupation"
                value={profile.occupation || "—"}
                icon={<BriefcaseBusiness size={15} />}
              />

              <InfoItem
                label="Birthdate"
                value={
                  profile.birthdate
                    ? new Date(
                      profile.birthdate
                    ).toLocaleDateString()
                    : "—"
                }
              />

              <InfoItem
                label="Address"
                value={profile.currentAddress || "—"}
                icon={<MapPin size={15} />}
              />

              <InfoItem
                label="Verified"
                value={
                  profile.isVerified ? "Verified" : "Not verified"
                }
              />
            </div>

            <div className="border-t border-[#EEF1EE] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B968F]">
                Bio
              </p>

              <p className="mt-2 rounded-xl bg-[#F7F9F7] px-4 py-3 text-sm leading-6 text-[#56635B]">
                {profile.bio || "No bio provided."}
              </p>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm xl:sticky xl:top-28">
          <h2 className="font-semibold text-[#26382F]">
            User overview
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#7B8780]">
            Review this account before changing its access
            status.
          </p>

          <div className="my-5 h-px bg-[#EEF1EE]" />

          <div className="space-y-4">
            <InfoItem
              label="Role"
              value={user.role || "USER"}
            />

            <InfoItem
              label="Status"
              value={user.status || "ACTIVE"}
            />

            <InfoItem
              label="Verification"
              value={
                profile.isVerified
                  ? "Verified"
                  : "Not verified"
              }
            />
          </div>

          <Link
            to="/admin/users"
            className="mt-5 inline-flex w-full items-center justify-center text-sm font-semibold text-[#647168] transition hover:text-forest"
          >
            Return to user list
          </Link>
        </aside>
      </div>
    </section>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div>
    <p className="text-xs font-medium text-[#8A958E]">
      {label}
    </p>

    <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#33463C]">
      {icon}
      <span className="wrap-break-word">{value}</span>
    </div>
  </div>
);

export default UserDetail;