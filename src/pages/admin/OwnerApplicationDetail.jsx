import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  FileCheck2,
  FileWarning,
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

const isPdfDocument = (url = "") =>
  /\.pdf(?:$|\?)/i.test(url);

const OwnerApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [moreDocumentsModalOpen, setMoreDocumentsModalOpen] =
    useState(false);

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
      status === "APPROVED" ? "approve" : "update";

    const confirmed =
      ["REJECTED", "NEED_MORE_DOCUMENTS"].includes(status) ||
      window.confirm(
        `Are you sure you want to ${action} this application?`
      );

    if (!confirmed) return;

    setUpdating(true);
    setError("");

    try {
      await api.patch(
        `/admin/owner-applications/${applicationId}`,
        ["REJECTED", "NEED_MORE_DOCUMENTS"].includes(status)
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

      if (status === "NEED_MORE_DOCUMENTS") {
        setMoreDocumentsModalOpen(false);
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

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    if (status === "NEED_MORE_DOCUMENTS") {
      return "bg-sky-50 text-sky-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  const formatStatus = (status) =>
    status.replaceAll("_", " ");

  if (loading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#DCE5DF] border-t-forest" />

          <p className="mt-4 text-sm font-medium text-[#7D8981]">
            Loading owner application...
          </p>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="rounded-2xl border border-[#E4E9E4] bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#EEF3EF] text-forest">
          <FileCheck2 size={26} />
        </div>

        <h1 className="mt-4 text-xl font-bold text-[#26372E]">
          Application unavailable
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm text-[#7B8780]">
          {error}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={fetchApplication}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white transition hover:bg-[#214A3D]"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          <Link
            to="/admin/owner-applications"
            className="inline-flex h-10 items-center rounded-xl border border-[#DDE4DE] bg-white px-4 text-sm font-semibold text-[#536159] transition hover:bg-[#F6F8F6]"
          >
            Back to applications
          </Link>
        </div>
      </div>
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

  const documents = (application.documents || []).filter(
    (document) => document.signedUrl
  );

  return (
    <section className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#647168] transition hover:text-forest"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829087]">
            Owner application
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E2F27] sm:text-3xl">
            {fullName}
          </h1>

          <p className="mt-2 text-sm text-[#7B8780]">
            Review applicant information and supporting documents
            before making a decision.
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
            status
          )}`}
        >
          {formatStatus(status)}
        </span>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Applicant information */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Applicant information
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  Personal and account details
                </p>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
              <InfoItem
                label="Full name"
                value={fullName}
              />

              <InfoItem
                label="Username"
                value={
                  user.username ||
                  application.username ||
                  "—"
                }
              />

              <InfoItem
                label="Email"
                value={
                  user.email ||
                  application.email ||
                  "—"
                }
                icon={<Mail size={15} />}
              />

              <InfoItem
                label="Phone number"
                value={
                  profile.phone ||
                  user.mobile ||
                  application.phone ||
                  "—"
                }
                icon={<Phone size={15} />}
              />

              <InfoItem
                label="Applicant type"
                value={applicantType
                  .replaceAll("_", " ")
                  .toLowerCase()}
              />

              <InfoItem
                label="Submitted"
                value={
                  application.createdAt
                    ? new Date(
                      application.createdAt
                    ).toLocaleString()
                    : "—"
                }
              />
            </div>
          </section>

          {/* Application details */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
                <FileCheck2 size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Application details
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  Reason, admin notes and supporting documents
                </p>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <DetailBlock
                label="Reason for applying"
                value={
                  application.reason ||
                  application.message ||
                  "No reason was provided."
                }
              />

              {application.rejectReason && (
                <DetailBlock
                  label="Admin message"
                  value={application.rejectReason}
                />
              )}

              {applicantType === "AGENT" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Agency name"
                    value={application.agencyName || "—"}
                  />

                  <InfoItem
                    label="Agent licence"
                    value={
                      application.licenseNumber ||
                      application.agentLicense ||
                      "—"
                    }
                  />
                </div>
              )}

              {documents.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B968F]">
                    Supporting documents
                  </p>

                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {documents.map((document, index) => (
                      <article
                        key={document.id || index}
                        className="overflow-hidden rounded-xl border border-[#E4E9E4] bg-[#FAFBFA]"
                      >
                        <div className="h-56 bg-[#EEF2EE]">
                          {isPdfDocument(document.signedUrl) ? (
                            <iframe
                              src={document.signedUrl}
                              title={`Supporting document ${index + 1}`}
                              className="h-full w-full"
                            />
                          ) : (
                            <img
                              src={document.signedUrl}
                              alt={`Supporting document ${index + 1}`}
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>

                        <a
                          href={document.signedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#355244] transition hover:bg-[#F5F8F5]"
                        >
                          Open document {index + 1}
                          <ExternalLink size={15} />
                        </a>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Decision */}
        <aside className="h-fit rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm xl:sticky xl:top-28">
          <h2 className="font-semibold text-[#26382F]">
            Review decision
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#7B8780]">
            Approving this application will grant the user
            owner access on RoomHub.
          </p>

          <div className="my-5 h-px bg-[#EEF1EE]" />

          {status === "PENDING" ? (
            <div className="space-y-3">
              <button
                type="button"
                disabled={updating}
                onClick={() => {
                  setError("");
                  setMoreDocumentsModalOpen(true);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white text-sm font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileWarning size={17} />
                Request more documents
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  updateStatus("APPROVED")
                }
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-forest text-sm font-semibold text-white transition hover:bg-[#214A3D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={17} />
                {updating ? "Updating..." : "Approve application"}
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => {
                  setError("");
                  setRejectModalOpen(true);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
                Reject application
              </button>
            </div>
          ) : (
            <div
              className={`rounded-xl px-4 py-4 text-sm font-semibold ${getStatusClass(
                status
              )}`}
            >
              This application has been{" "}
              {formatStatus(status).toLowerCase()}.
            </div>
          )}

          <Link
            to="/admin/owner-applications"
            className="mt-4 inline-flex w-full items-center justify-center text-sm font-semibold text-[#647168] transition hover:text-forest"
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

      {moreDocumentsModalOpen && (
        <RejectReasonModal
          entityLabel="owner application"
          title="Request more documents"
          description="Explain which corrected or additional documents the applicant must provide."
          fieldLabel="Admin message"
          placeholder="Describe the documents required"
          submitLabel="Request documents"
          submittingLabel="Requesting..."
          isSubmitting={updating}
          error={error}
          onCancel={() => {
            if (!updating) {
              setMoreDocumentsModalOpen(false);
              setError("");
            }
          }}
          onReject={(message) =>
            updateStatus(
              "NEED_MORE_DOCUMENTS",
              message
            )
          }
        />
      )}
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

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B968F]">
      {label}
    </p>

    <p className="mt-2 rounded-xl bg-[#F7F9F7] px-4 py-3 text-sm leading-6 text-[#56635B]">
      {value}
    </p>
  </div>
);

export default OwnerApplicationDetail;