import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  DoorOpen,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getApiErrorMessage } from "../../services/api.js";
import { getRentalApi } from "../../services/ownerApi.js";

const formatDate = (value, empty = "Ongoing") =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : empty;

const OwnerRentalDetailPage = () => {
  const { rentalId } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getRentalApi(rentalId)
      .then(({ data }) => {
        if (active) setRental(data);
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError, "Unable to load rental"));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [rentalId]);

  if (loading) {
    return <div className="owner-loading">Loading rental...</div>;
  }

  if (!rental) {
    return (
      <section className="mx-auto w-full max-w-330">
        <Link
          to="/owner/rentals"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
        >
          <ArrowLeft size={17} /> Back to Rentals
        </Link>
        <p className="owner-alert" role="alert">
          {error || "Rental not found"}
        </p>
      </section>
    );
  }

  const target = rental.room?.roomName || "Whole property";

  return (
    <section className="owner-resource-page mx-auto w-full max-w-330">
      <Link
        to="/owner/rentals"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
      >
        <ArrowLeft size={17} /> Back to Rentals
      </Link>

      <header className="mb-5 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="owner-eyebrow">Rental #{rental.id}</p>
          <h1 className="mt-1 break-words font-serif text-2xl leading-tight text-ink">
            {rental.property?.title || `Property #${rental.propertyId}`}
          </h1>
          <p className="mt-1 text-sm text-muted-copy">{target}</p>
        </div>

        <span
          className={`owner-status status-${rental.status?.toLowerCase()} shrink-0 whitespace-nowrap`}
        >
          {rental.status}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-2xl border border-line bg-white p-6 shadow-[0_6px_22px_rgba(50,66,54,.06)]">
          <h2 className="font-serif text-2xl">Rental details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Detail
              icon={<Building2 size={20} />}
              label="Property"
              value={rental.property?.title || `Property #${rental.propertyId}`}
            />
            <Detail icon={<DoorOpen size={20} />} label="Room" value={target} />
            <Detail
              icon={<CalendarDays size={20} />}
              label="Start date"
              value={formatDate(rental.startDate)}
            />
            <Detail
              icon={<CalendarDays size={20} />}
              label="End date"
              value={formatDate(rental.endDate)}
            />
            <Detail
              icon={<Banknote size={20} />}
              label="Monthly rent"
              value={`฿${Number(rental.monthlyRent || 0).toLocaleString()}`}
            />
            <Detail
              icon={<CalendarDays size={20} />}
              label="Created"
              value={formatDate(rental.createdAt, "Not set")}
            />
          </div>
        </article>

        <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_6px_22px_rgba(50,66,54,.06)]">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-sage-light text-sage-dark">
              <Users size={21} />
            </span>
            <div>
              <p className="text-xs font-semibold text-muted-copy">Tenants</p>
              <h2 className="font-serif text-2xl">
                {rental.members?.length || 0}
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {rental.members?.length ? (
              rental.members.map(({ user }) => {
                const name = [user.profile?.firstName, user.profile?.lastName]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <div key={user.id} className="rounded-xl bg-cream p-4">
                    <strong>{name || user.username}</strong>
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-copy">
                      <Mail size={14} /> {user.email}
                    </p>
                    {user.profile?.phone && (
                      <p className="mt-1 flex items-center gap-2 text-sm text-muted-copy">
                        <Phone size={14} /> {user.profile.phone}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-copy">
                No tenants are attached to this rental.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex gap-3 rounded-xl bg-cream p-4">
    <span className="mt-0.5 text-sage-dark">{icon}</span>
    <div>
      <p className="text-xs font-semibold text-muted-copy">{label}</p>
      <strong className="mt-1 block">{value}</strong>
    </div>
  </div>
);

export default OwnerRentalDetailPage;
