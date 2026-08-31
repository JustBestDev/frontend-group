import { useEffect, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import api from "../../services/api";

function OwnerApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                "/admin/owner-applications"
            );

            setApplications(response.data.data ?? []);
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

    const updateApplication = async (applicationId, status) => {
        const confirmed = window.confirm(
            `Are you sure you want to ${status.toLowerCase()} this application?`
        );

        if (!confirmed) return;

        setUpdatingId(applicationId);
        setError("");

        try {
            await api.patch(
                `/admin/owner-applications/${applicationId}`,
                { status }
            );

            setApplications((currentApplications) =>
                currentApplications.map((application) =>
                    application.id === applicationId
                        ? { ...application, status }
                        : application
                )
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
                    <p className="admin-eyebrow">Administration</p>
                    <h1>Owner Applications</h1>
                    <p>
                        Review requests from users who want to
                        become property owners.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    type="button"
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
                        <p>There are no applications to review.</p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Email</th>
                                    <th>Reason</th>
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

                                    return (
                                        <tr key={applicationId}>
                                            <td>
                                                <strong>
                                                    {user.username ||
                                                        user.profile
                                                            ?.firstName ||
                                                        application.username ||
                                                        "Unknown user"}
                                                </strong>
                                            </td>

                                            <td>
                                                {user.email ||
                                                    application.email ||
                                                    "—"}
                                            </td>

                                            <td className="reason-cell">
                                                {application.reason ||
                                                    application.message ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge status-${application.status?.toLowerCase()}`}
                                                >
                                                    {application.status ||
                                                        "PENDING"}
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
                                                {application.status ===
                                                "PENDING" ? (
                                                    <div className="table-actions">
                                                        <button
                                                            className="action-button approve-button"
                                                            type="button"
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
                                                            className="action-button reject-button"
                                                            type="button"
                                                            disabled={
                                                                updatingId ===
                                                                applicationId
                                                            }
                                                            onClick={() =>
                                                                updateApplication(
                                                                    applicationId,
                                                                    "REJECTED"
                                                                )
                                                            }
                                                        >
                                                            <X size={16} />
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="reviewed-text">
                                                        Reviewed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default OwnerApplications;