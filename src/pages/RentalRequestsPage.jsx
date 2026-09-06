import { Building2, CalendarDays, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../services/api.js";

const formatDate = (value, empty = "Not set") =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : empty;

const RentalRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/rental-requests/me");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setRequests(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load rental requests"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchRequests();
  }, [fetchRequests]);

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-ink sm:px-6">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-terracotta">Rental applications</p>
            <h1 className="font-serif text-3xl font-bold">My Rental Requests</h1>
            <p className="mt-1 text-sm text-muted-copy">Track requests sent to property owners.</p>
          </div>
          <button
            type="button"
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-sage-light disabled:opacity-60"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={17} /> Refresh
          </button>
        </header>

        {error && <p className="mb-4 rounded-xl bg-[#fde8e6] px-4 py-3 text-danger" role="alert">{error}</p>}
        {loading ? (
          <div className="grid min-h-72 place-content-center rounded-2xl border border-line bg-white text-muted-copy">Loading rental requests...</div>
        ) : requests.length === 0 ? (
          <div className="grid min-h-72 place-content-center justify-items-center rounded-2xl border border-line bg-white text-center text-muted-copy">
            <Building2 size={42} />
            <h2 className="mt-3 font-serif text-xl font-bold text-ink">No rental requests</h2>
            <p>Your direct and group rental requests will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-line bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="mb-2 inline-flex rounded-full bg-sage-light px-2.5 py-1 text-xs font-bold text-sage-dark">
                      {request.communityPostId ? "Group Rental" : "Direct Rental"}
                    </span>
                    <h2 className="font-serif text-xl font-bold">{request.property?.title || `Property #${request.propertyId}`}</h2>
                    <p className="mt-1 text-sm text-muted-copy">
                      {request.room?.roomName ? `Room: ${request.room.roomName}` : "Whole Property"}
                    </p>
                    {request.communityPost && (
                      <p className="mt-1 text-sm text-muted-copy">
                        Community: {request.communityPost.title}
                      </p>
                    )}
                  </div>
                  <span className={`owner-status status-${request.status.toLowerCase()}`}>{request.status}</span>
                </div>
                <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className="text-muted-copy">Start date</dt><dd className="font-semibold">{formatDate(request.startDate)}</dd></div>
                  <div><dt className="text-muted-copy">End date</dt><dd className="font-semibold">{formatDate(request.endDate, "Ongoing")}</dd></div>
                  <div><dt className="text-muted-copy">Requested</dt><dd className="font-semibold">{formatDate(request.createdAt)}</dd></div>
                  <div><dt className="text-muted-copy">Reviewed</dt><dd className="font-semibold">{formatDate(request.reviewedAt, "Not reviewed")}</dd></div>
                </dl>
                <p className="mt-4 flex items-center gap-2 text-xs text-muted-copy">
                  <CalendarDays size={15} /> Rental target: {request.room ? "Individual Room" : "Whole Property"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default RentalRequestsPage;
