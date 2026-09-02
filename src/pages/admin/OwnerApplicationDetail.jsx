import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  FileCheck2,
  Mail,
  Phone,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";
import api from "../../services/api";
import RejectReasonModal from "../../components/admin/RejectReasonModal";

const OwnerApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchApplication = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/admin/owner-applications/${applicationId}`
      );

      const applicationData =
        response.data.data?.application ||
        response.data.data ||
        response.data.application;

      setApplication(applicationData || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve owner application"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const updateStatus = async (status, rejectReason) => {
    const action =
      status === "APPROVED" ? "approve" : "reject";
    const confirmed =
      status === "REJECTED" ||
      window.confirm(
        `Are you sure you want to ${action} this application?`
      );

    if (!confirmed) return;

    setUpdating(true);
    setError("");

    try {
      await api.patch(
        `/admin/owner-applications/${applicationId}`,
        status === "REJECTED"
          ? { status, rejectReason }
          : { status }
      );

      setApplication((currentApplication) => ({
        ...currentApplication,
        status,
        ...(rejectReason ? { rejectReason } : {}),
      }));

      window.alert(
        `Application ${status.toLowerCase()} successfully`
      );
      if (status === "REJECTED") {
        setRejectModalOpen(false);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update application"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-message">
        Loading owner application...
      </div>
    );
  }

  if (error && !application) {
    return (
      <section className="admin-content">
        <div className="admin-detail-error">
          <FileCheck2 size={42} />

          <h1>Application unavailable</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchApplication}
          >
            <RefreshCw size={17} />
            Try again
          </button>

          <Link to="/admin/owner-applications">
            Back to applications
          </Link>
        </div>
      </section>
    );
  }

  if (!application) return null;

  const user =
    application.user ||
    application.applicant ||
    application.owner ||
    {};

  const profile = user.profile || {};

  const fullName =
    profile.fullName ||
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ") ||
    application.fullName ||
    user.username ||
    "Unknown applicant";

  const applicantType =
    application.applicantType ||
    application.applicationType ||
    application.type ||
    "OWNER";

  const status = application.status || "PENDING";

  return (
    <section className="admin-content">
      <button
        type="button"
        className="admin-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="admin-detail-heading">
        <div>
          <p className="admin-eyebrow">
            Owner application
          </p>

          <h1>{fullName}</h1>

          <p>
            Review the applicant information before making
            a decision.
          </p>
        </div>

        <span
          className={`status-badge status-${status.toLowerCase()}`}
        >
          {status}
        </span>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-detail-layout">
        <div className="admin-detail-main">
          <section className="admin-detail-card">
            <div className="admin-detail-card-heading">
              <UserRound size={21} />
              <h2>Applicant information</h2>
            </div>

            <div className="admin-information-grid">
              <div>
                <span>Full name</span>
                <strong>{fullName}</strong>
              </div>

              <div>
                <span>Username</span>
                <strong>
                  {user.username ||
                    application.username ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  <Mail size={15} />
                  {user.email ||
                    application.email ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Phone number</span>
                <strong>
                  <Phone size={15} />
                  {profile.phone ||
                    user.mobile ||
                    application.phone ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Applicant type</span>
                <strong>
                  {applicantType
                    .replaceAll("_", " ")
                    .toLowerCase()}
                </strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-card">
            <div className="admin-detail-card-heading">
              <FileCheck2 size={21} />
              <h2>Application details</h2>
            </div>

            <div className="application-detail-section">
              <div>
                <span>Reason for applying</span>

                <p>
                  {application.reason ||
                    application.message ||
                    "No reason was provided."}
                </p>
              </div>

              {applicantType === "AGENT" && (
                <>
                  <div>
                    <span>Agency name</span>
                    <p>
                      {application.agencyName || "—"}
                    </p>
                  </div>

                  <div>
                    <span>Agent licence</span>
                    <p>
                      {application.licenseNumber ||
                        application.agentLicense ||
                        "—"}
                    </p>
                  </div>
                </>
              )}

              {application.documentUrl && (
                <div>
                  <span>Supporting document</span>

                  <a
                    href={application.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View document
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="admin-decision-card">
          <h2>Review decision</h2>

          <p>
            Approving this application will grant the user
            owner access.
          </p>

          {status === "PENDING" ? (
            <div className="admin-decision-actions">
              <button
                type="button"
                className="admin-approve-button"
                disabled={updating}
                onClick={() =>
                  updateStatus("APPROVED")
                }
              >
                <Check size={18} />
                Approve application
              </button>

              <button
                type="button"
                className="admin-reject-button"
                disabled={updating}
                onClick={() => {
                  setError("");
                  setRejectModalOpen(true);
                }}
              >
                <X size={18} />
                Reject application
              </button>
            </div>
          ) : (
            <div
              className={`admin-decision-result result-${status.toLowerCase()}`}
            >
              This application has been{" "}
              {status.toLowerCase()}.
            </div>
          )}

          <Link
            className="admin-return-link"
            to="/admin/owner-applications"
          >
            Return to application list
          </Link>
        </aside>
      </div>

      {rejectModalOpen && (
        <RejectReasonModal
          entityLabel="owner application"
          isSubmitting={updating}
          error={error}
          onCancel={() => {
            if (!updating) {
              setRejectModalOpen(false);
              setError("");
            }
          }}
          onReject={(rejectReason) =>
            updateStatus("REJECTED", rejectReason)
          }
        />
      )}
    </section>
  );
};

export default OwnerApplicationDetail;
