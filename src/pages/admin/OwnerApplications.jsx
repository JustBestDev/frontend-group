import { useEffect, useState } from "react";
import {
  Check,
  Eye,
  RefreshCw,
  FileWarning,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../services/api";
import RejectReasonModal from "../../components/admin/RejectReasonModal";

const OwnerApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] =
    useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [requestingDocumentsId, setRequestingDocumentsId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/admin/owner-applications"
      );

      const applicationData =
        response.data.data?.applications ||
        response.data.data ||
        response.data.applications ||
        [];

      setApplications(
        Array.isArray(applicationData)
          ? applicationData
          : []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve owner applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateApplication = async (
    applicationId,
    status,
    rejectReason
  ) => {
    const action = status === "APPROVED" ? "approve" : "update";
    const confirmed =
      ["REJECTED", "NEED_MORE_DOCUMENTS"].includes(status) ||
      window.confirm(
        `Are you sure you want to ${action} this application?`
      );

    if (!confirmed) return;

    setUpdatingId(applicationId);
    setError("");

    try {
      await api.patch(
        `/admin/owner-applications/${applicationId}`,
        ["REJECTED", "NEED_MORE_DOCUMENTS"].includes(status)
          ? { status, rejectReason }
          : { status }
      );
      if (status === "REJECTED") setRejectingId(null);
      if (status === "NEED_MORE_DOCUMENTS") setRequestingDocumentsId(null);

      setApplications((currentApplications) =>
        currentApplications.map((application) => {
          const currentId =
            application.id ||
            application.applicationId;

          return currentId === applicationId
            ? {
                ...application,
                status,
                ...(rejectReason
                  ? { rejectReason }
                  : {}),
              }
            : application;
        })
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update the application"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-message">
        Loading owner applications...
      </div>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            Administration
          </p>

          <h1>Owner Applications</h1>

          <p>
            Review requests from users who want to become
            property owners.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchApplications}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-table-card">
        {applications.length === 0 ? (
          <div className="empty-state">
            <h2>No owner applications</h2>

            <p>
              There are no applications to review.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Admin message</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => {
                  const user =
                    application.user ||
                    application.applicant ||
                    {};

                  const applicationId =
                    application.id ||
                    application.applicationId;

                  const status =
                    application.status || "PENDING";

                  const applicantName =
                    user.username ||
                    user.profile?.displayName ||
                    user.profile?.firstName ||
                    application.username ||
                    "Unknown user";

                  return (
                    <tr key={applicationId}>
                      <td>
                        <strong>
                          {applicantName}
                        </strong>
                      </td>

                      <td>
                        {user.email ||
                          application.email ||
                          "—"}
                      </td>

                      <td className="reason-cell">
                        {application.rejectReason ||
                          application.reason ||
                          application.message ||
                          "—"}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${status.toLowerCase().replaceAll("_", "-")}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-button view-button"
                            onClick={() =>
                              navigate(
                                `/admin/owner-applications/${applicationId}`
                              )
                            }
                          >
                            <Eye size={16} />
                            View
                          </button>

                          {status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                className="action-button view-button"
                                disabled={updatingId === applicationId}
                                onClick={() => {
                                  setError("");
                                  setRequestingDocumentsId(applicationId);
                                }}
                              >
                                <FileWarning size={16} />
                                Request documents
                              </button>

                              <button
                                type="button"
                                className="action-button approve-button"
                                disabled={
                                  updatingId ===
                                  applicationId
                                }
                                onClick={() =>
                                  updateApplication(
                                    applicationId,
                                    "APPROVED"
                                  )
                                }
                              >
                                <Check size={16} />
                                Approve
                              </button>

                              <button
                                type="button"
                                className="action-button reject-button"
                                disabled={
                                  updatingId ===
                                  applicationId
                                }
                                onClick={() => {
                                  setError("");
                                  setRejectingId(applicationId);
                                }}
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejectingId !== null && (
        <RejectReasonModal
          entityLabel="owner application"
          isSubmitting={updatingId === rejectingId}
          error={error}
          onCancel={() => {
            if (updatingId !== rejectingId) {
              setRejectingId(null);
              setError("");
            }
          }}
          onReject={(rejectReason) =>
            updateApplication(
              rejectingId,
              "REJECTED",
              rejectReason
            )
          }
        />
      )}

      {requestingDocumentsId !== null && (
        <RejectReasonModal
          entityLabel="owner application"
          title="Request more documents"
          description="Explain which corrected or additional documents the applicant must provide."
          fieldLabel="Admin message"
          placeholder="Describe the documents required"
          submitLabel="Request documents"
          submittingLabel="Requesting..."
          isSubmitting={updatingId === requestingDocumentsId}
          error={error}
          onCancel={() => {
            if (updatingId !== requestingDocumentsId) {
              setRequestingDocumentsId(null);
              setError("");
            }
          }}
          onReject={(message) => updateApplication(requestingDocumentsId, "NEED_MORE_DOCUMENTS", message)}
        />
      )}
    </section>
  );
};

export default OwnerApplications;
