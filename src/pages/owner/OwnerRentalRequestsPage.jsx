import { Building2, CalendarDays, ClipboardCheck, ClipboardList, Clock3, Loader2, RefreshCw, Search, Users, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import RentalRequestActions from "../../components/owner/RentalRequestActions.jsx";
import { getApiErrorMessage } from "../../services/api.js";
import {
  getOwnerRentalRequestsApi,
  markOwnerRentalRequestsViewedApi,
  reviewOwnerRentalRequestApi,
} from "../../services/ownerApi.js";
import { ownerRentalRequestPath } from "../../utils/ownerRoutes.js";

const FILTERS = ["ALL", "PENDING", "ACCEPTED", "REJECTED"];
const formatDate = (value, empty = "Not set") => value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : empty;

const OwnerRentalRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOwnerRentalRequestsApi();
      setRequests(Array.isArray(response.data) ? response.data : []);
      await markOwnerRentalRequestsViewedApi();
      window.dispatchEvent(new Event("owner-notifications:refresh"));
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

  const reviewRequest = async (requestId, action) => {
    setReviewingId(requestId);
    setError("");
    setSuccess("");
    try {
      await reviewOwnerRentalRequestApi(requestId, action);
      setSuccess(`Rental request ${action === "ACCEPT" ? "accepted" : "rejected"} successfully.`);
      await fetchRequests();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to review rental request"));
    } finally {
      setReviewingId(null);
    }
  };

  const counts = useMemo(() => ({
    ALL: requests.length,
    PENDING: requests.filter(({ status }) => status === "PENDING").length,
    ACCEPTED: requests.filter(({ status }) => status === "ACCEPTED").length,
    REJECTED: requests.filter(({ status }) => status === "REJECTED").length,
  }), [requests]);

  const visibleRequests = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return requests.filter((request) => {
      const searchable = [request.requester?.username, request.property?.title, request.room?.roomName, request.communityPost?.title].filter(Boolean).join(" ").toLowerCase();
      return (filter === "ALL" || request.status === filter) && (!keyword || searchable.includes(keyword));
    });
  }, [filter, query, requests]);

  return (
    <section className="owner-resource-page mx-auto w-full max-w-330">
      <header className="owner-resource-header mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
        <div>
          <p className="owner-eyebrow">Incoming applications</p>
          <h1>Rental Requests</h1>
          <p>Review prospective tenants and manage requests for your properties.</p>
        </div>
        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="owner-secondary-button justify-center disabled:opacity-60">
          <RefreshCw className={loading ? "animate-spin" : ""} size={17} /> Refresh
        </button>
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Stat icon={<Clock3 size={21} />} label="Awaiting review" value={counts.PENDING} tone="bg-[#fff1d2] text-[#8d681e]" />
        <Stat icon={<ClipboardCheck size={21} />} label="Accepted" value={counts.ACCEPTED} tone="bg-[#e5f2e5] text-[#47724f]" />
        <Stat icon={<X size={21} />} label="Rejected" value={counts.REJECTED} tone="bg-[#fde8e6] text-danger" />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 text-muted-copy sm:max-w-96">
          <Search size={18} /><span className="sr-only">Search rental requests</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tenant, property or room"
            className="w-full bg-transparent py-3 text-sm text-ink outline-none" />
        </label>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1" aria-label="Filter requests by status">
          {FILTERS.map((status) =>
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition ${filter === status ? "bg-sage-light text-sage-dark" : "text-muted-copy hover:bg-cream"}`}>
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              <span className="ml-1 opacity-65">{counts[status]}</span>
            </button>
          )}
        </div>
      </div>

      {error && <p className="owner-alert mb-4" role="alert">{error}</p>}
      {success && <p className="owner-success mb-4" role="status">{success}</p>}

      {loading ? (
        <div className="owner-loading"><Loader2 className="mb-3 animate-spin" size={30} /><p>Loading rental requests...</p></div>
      ) : visibleRequests.length === 0 ? (
        <div className="owner-empty-state">
          <span className="grid size-14 place-items-center rounded-full bg-sage-light text-sage-dark"><ClipboardList size={28} /></span>
          <h2>{requests.length ? "No matching requests" : "No rental requests yet"}</h2>
          <p>{requests.length ? "Try changing your search or status filter." : "New tenant applications will appear here when someone requests to rent."}</p>
          {!requests.length && <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs"><span className="rounded-full bg-cream px-3 py-1.5">Direct rentals</span><span className="rounded-full bg-cream px-3 py-1.5">Group rentals</span><span className="rounded-full bg-cream px-3 py-1.5">Room requests</span></div>}
        </div>
      ) : (
        <div className="grid gap-4">{visibleRequests.map((request) => <RequestCard key={request.id} request={request} reviewingId={reviewingId} onReview={reviewRequest} />)}</div>
      )}
    </section>
  );
};

const Stat = ({ icon, label, value, tone }) => <article className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_5px_18px_rgba(50,66,54,.05)]">
  <span className={`grid size-11 place-items-center rounded-full ${tone}`}>{icon}</span>
  <div><p className="text-xs font-semibold text-muted-copy">{label}</p><strong className="font-serif text-2xl">{value}</strong>
  </div>
</article>;

const RequestCard = ({ request, reviewingId, onReview }) => {
  const isGroup = Boolean(request.communityPostId);
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_6px_22px_rgba(50,66,54,.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-light font-serif text-lg font-bold text-sage-dark">{request.requester?.username?.charAt(0)?.toUpperCase() || "U"}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-serif text-xl font-bold">{request.requester?.username || `User #${request.requesterId}`}</h2>
              <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-copy">{isGroup ? "Group rental" : "Direct rental"}</span>
            </div><p className="mt-1 text-xs text-muted-copy">Request #{request.id} · Submitted {formatDate(request.createdAt)}</p>
          </div>
        </div>
        <span className={`owner-status status-${request.status.toLowerCase()}`}>{request.status}</span>
      </div>
      <div className="flex justify-between p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1.25fr_1fr_1fr]">
        <Detail icon={<Building2 size={19} />} label="Property" title={request.property?.title || `Property #${request.propertyId}`} text={request.room?.roomName ? `Room: ${request.room.roomName}` : "Whole property"} />
        <Detail icon={<CalendarDays size={19} />} label="Rental period" title={formatDate(request.startDate)} text={`to ${formatDate(request.endDate, "Ongoing")}`} />
        <Detail icon={<Users size={19} />} label="Application type" title={isGroup ? "Community group" : "Individual tenant"} text={request.communityPost?.title || (request.room ? "Individual room" : "Whole unit")} />
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 bg-[#faf9f4] px-5 py-4 sm:px-6">
        <p className="text-xs text-muted-copy">{request.reviewedAt ? `Reviewed on ${formatDate(request.reviewedAt)}` : "Review the rental details before making a decision."}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            to={ownerRentalRequestPath(request.id)}
            className="inline-flex cursor-pointer items-center rounded-xl border border-sage-dark px-4 py-2.5 text-sm font-bold text-sage-dark transition hover:bg-sage-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark"
          >
            View details
          </Link>
          {request.status === "PENDING" && (
            <RentalRequestActions
              requestId={request.id}
              reviewingId={reviewingId}
              onReview={onReview}
            />
          )}
        </div>
      </footer>
    </article>
  );
};

const Detail = ({ icon, label, title, text }) =>
  <div className="flex gap-3">
    <span className="mt-0.5 shrink-0 text-sage-dark">{icon}</span>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-copy">{label}</p>
      <p className="mt-1 font-semibold">{title}</p><p className="mt-1 text-sm text-muted-copy">{text}</p>
    </div>
  </div>;

export default OwnerRentalRequestsPage;
