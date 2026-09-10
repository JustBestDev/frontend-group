import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardList,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import RentalRequestActions from "../../components/owner/RentalRequestActions.jsx";
import { getApiErrorMessage } from "../../services/api.js";
import {
  getOwnerRentalRequestsApi,
  markOwnerRentalRequestsViewedApi,
  reviewOwnerRentalRequestApi,
} from "../../services/ownerApi.js";
import { findOwnerRentalRequest } from "../../utils/ownerRoutes.js";

const formatDate = (value, empty = "Not set") =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : empty;

const OwnerRentalRequestDetailPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequest = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOwnerRentalRequestsApi();
      const found = findOwnerRentalRequest(response.data || [], requestId);
      setRequest(found || null);
      if (!found) setError("Rental request not found");
      await markOwnerRentalRequestsViewedApi();
      window.dispatchEvent(new Event("owner-notifications:refresh"));
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Unable to load rental request"),
      );
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchRequest();
  }, [fetchRequest]);

  const reviewRequest = async (id, action) => {
    setReviewingId(id);
    setError("");
    setSuccess("");
    try {
      const response = await reviewOwnerRentalRequestApi(id, action);
      setRequest(response.data);
      setSuccess(
        `Rental request ${action === "ACCEPT" ? "accepted" : "rejected"} successfully.`,
      );
      window.dispatchEvent(new Event("owner-notifications:refresh"));
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Unable to review rental request"),
      );
    } finally {
      setReviewingId(null);
    }
  };

  if (loading) {
    return <div className="owner-loading">Loading rental request...</div>;
  }

  if (!request) {
    return (
      <section className="mx-auto w-full max-w-330">
        <Link
          to="/owner/rental-requests"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
        >
          <ArrowLeft size={17} /> Back to Rental Requests
        </Link>
        <p className="owner-alert" role="alert">
          {error || "Rental request not found"}
        </p>
      </section>
    );
  }

  const isGroup = Boolean(request.communityPostId);

  return (
    <section className="owner-resource-page mx-auto w-full max-w-330">
      <Link
        to="/owner/rental-requests"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
      >
        <ArrowLeft size={17} /> Back to Rental Requests
      </Link>

      <header className="mb-5 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="owner-eyebrow">Request #{request.id}</p>

          <h1 className="mt-1 break-words font-serif text-2xl leading-tight text-ink">
            {request.requester?.username || `User #${request.requesterId}`}
          </h1>

          <p className="mt-1 text-sm text-muted-copy">
            Submitted {formatDate(request.createdAt)}
          </p>
        </div>

        <span
          className={`owner-status status-${request.status?.toLowerCase()} shrink-0 whitespace-nowrap`}
        >
          {request.status}
        </span>
      </header>

      {error && (
        <p className="owner-alert mb-4" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="owner-success mb-4" role="status">
          {success}
        </p>
      )}

      <article className="rounded-2xl border border-line bg-white p-6 shadow-[0_6px_22px_rgba(50,66,54,.06)]">
        <h2 className="font-serif text-2xl">Request details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Detail
            icon={<Users size={20} />}
            label="Requester"
            title={
              request.requester?.username || `User #${request.requesterId}`
            }
            text={isGroup ? "Community group" : "Individual tenant"}
          />
          <Detail
            icon={<Building2 size={20} />}
            label="Property / room"
            title={request.property?.title || `Property #${request.propertyId}`}
            text={request.room?.roomName || "Whole property"}
          />
          <Detail
            icon={<CalendarDays size={20} />}
            label="Requested period"
            title={formatDate(request.startDate)}
            text={`to ${formatDate(request.endDate, "Ongoing")}`}
          />
          <Detail
            icon={<ClipboardList size={20} />}
            label="Application type"
            title={isGroup ? "Group rental" : "Direct rental"}
            text={request.communityPost?.title || "No community group"}
          />
          <Detail
            icon={<CalendarDays size={20} />}
            label="Reviewed"
            title={formatDate(request.reviewedAt, "Not reviewed")}
            text={`Current status: ${request.status}`}
          />
        </div>

        {request.status === "PENDING" && (
          <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <p className="text-sm text-muted-copy">
              Review the request before making a decision.
            </p>
            <RentalRequestActions
              requestId={request.id}
              reviewingId={reviewingId}
              onReview={reviewRequest}
            />
          </footer>
        )}
      </article>
    </section>
  );
};

const Detail = ({ icon, label, title, text }) => (
  <div className="flex gap-3 rounded-xl bg-cream p-4">
    <span className="mt-0.5 shrink-0 text-sage-dark">{icon}</span>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-copy">
        {label}
      </p>
      <p className="mt-1 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-copy">{text}</p>
    </div>
  </div>
);

export default OwnerRentalRequestDetailPage;
