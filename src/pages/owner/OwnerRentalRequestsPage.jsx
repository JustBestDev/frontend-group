import { ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../../services/api.js";

const formatDate = (value, empty = "Not set") =>
  value ? new Date(value).toLocaleDateString("en-GB") : empty;

const OwnerRentalRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/rental-requests/owner");
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

  const reviewRequest = async (requestId, action) => {
    setReviewingId(requestId);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/rental-requests/${requestId}`, { action });
      setSuccess(`Rental request ${action.toLowerCase()}ed successfully.`);
      await fetchRequests();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to review rental request"));
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <section className="owner-resource-page mx-auto w-full max-w-330">
      <header className="owner-resource-header mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
        <div>
          <p className="owner-eyebrow">Incoming applications</p>
          <h1>Rental Requests</h1>
          <p>Review direct and group requests for your properties and rooms.</p>
        </div>
        <button type="button" onClick={fetchRequests} disabled={loading} className="owner-secondary-button justify-center disabled:opacity-60">
          <RefreshCw className={loading ? "animate-spin" : ""} size={17} /> Refresh
        </button>
      </header>

      {error && <p className="owner-alert mb-4" role="alert">{error}</p>}
      {success && <p className="owner-success mb-4" role="status">{success}</p>}

      {loading ? (
        <div className="owner-loading">Loading rental requests...</div>
      ) : requests.length === 0 ? (
        <div className="owner-empty-state">
          <ClipboardList size={42} />
          <h2>No rental requests</h2>
          <p>New tenant applications will appear here.</p>
        </div>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead><tr><th>Requester</th><th>Property / target</th><th>Rental period</th><th>Submitted / reviewed</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.map((request) => {
                const reviewing = reviewingId === request.id;
                return (
                  <tr key={request.id}>
                    <td><strong>{request.requester?.username || `User #${request.requesterId}`}</strong><small>{request.communityPostId ? "Group Rental" : "Direct Rental"}</small></td>
                    <td><strong>{request.property?.title || `Property #${request.propertyId}`}</strong><small>{request.property?.rentType?.replaceAll("_", " ") || (request.room ? "INDIVIDUAL ROOM" : "WHOLE UNIT")} · {request.room?.roomName || "Whole Property"}</small>{request.communityPost && <small>Community: {request.communityPost.title}</small>}</td>
                    <td>{formatDate(request.startDate)}<small>to {formatDate(request.endDate, "Ongoing")}</small></td>
                    <td>{formatDate(request.createdAt)}<small>{request.reviewedAt ? `Reviewed ${formatDate(request.reviewedAt)}` : "Not reviewed"}</small></td>
                    <td><span className={`owner-status status-${request.status.toLowerCase()}`}>{request.status}</span></td>
                    <td>
                      {request.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => reviewRequest(request.id, "ACCEPT")} disabled={reviewingId !== null} className="rounded-lg bg-sage-dark px-3 py-2 font-bold text-white disabled:opacity-60">
                            {reviewing ? <Loader2 className="animate-spin" size={16} /> : "Accept"}
                          </button>
                          <button type="button" onClick={() => reviewRequest(request.id, "REJECT")} disabled={reviewingId !== null} className="rounded-lg border border-danger px-3 py-2 font-bold text-danger disabled:opacity-60">Reject</button>
                        </div>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default OwnerRentalRequestsPage;
