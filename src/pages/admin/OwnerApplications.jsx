import {
  Check,
  Eye,
  FileWarning,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import useOwnerApplications from "../../hooks/useOwnerApplications.js";
import RejectReasonModal from "../../components/admin/RejectReasonModal";

const OwnerApplications = () => {
  const navigate = useNavigate();

  const {
    setError,
    loading,
    error,
    updatingId,
    rejectingId,
    setRejectingId,
    requestingDocumentsId,
    setRequestingDocumentsId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    fetchApplications,
    updateApplication,
    filteredApplications,
    pendingCount,
    approvedCount,
    rejectedCount,
    documentsCount,
  } = useOwnerApplications();

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
            Loading owner applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829087]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E2F27]">
            Owner applications
          </h1>

          <p className="mt-1.5 text-sm text-[#7B8780]">
            Review users requesting permission to list and manage
            properties on RoomHub.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DDE4DE] bg-white px-4 text-sm font-semibold text-[#45554C] shadow-sm transition hover:bg-[#F6F8F6]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Pending review
          </p>
          <p className="mt-1 text-xl font-bold text-[#22352B]">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Approved
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-700">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            More documents
          </p>
          <p className="mt-1 text-xl font-bold text-sky-700">
            {documentsCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Rejected
          </p>
          <p className="mt-1 text-xl font-bold text-red-700">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E4E9E4] bg-white p-3 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA39D]"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by applicant or email..."
            className="h-10 w-full rounded-lg border border-[#E2E8E3] bg-[#F8FAF8] pl-10 pr-4 text-sm text-[#26352D] outline-none transition placeholder:text-[#A0AAA4] focus:border-sage focus:bg-white focus:ring-4 focus:ring-[#A9BBA3]/15"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="h-10 rounded-lg border border-[#E2E8E3] bg-[#F8FAF8] px-3 text-sm font-medium text-[#536159] outline-none transition focus:border-sage focus:bg-white focus:ring-4 focus:ring-[#A9BBA3]/15"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="NEED_MORE_DOCUMENTS">
            More documents
          </option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Table */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-[#E4E9E4] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
            <UserRound size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-[#26372E]">
            No owner applications found
          </h2>

          <p className="mt-1 text-sm text-[#879189]">
            No applications match the current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-262.5">
              <thead className="bg-[#F7F9F7]">
                <tr className="border-b border-[#E9EDE9]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Applicant
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Admin message
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Submitted
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEF1EE]">
                {filteredApplications.map(
                  (application) => {
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

                    const email =
                      user.email ||
                      application.email ||
                      "—";

                    const adminMessage =
                      application.rejectReason ||
                      application.reason ||
                      application.message ||
                      "—";

                    return (
                      <tr
                        key={applicationId}
                        className="transition hover:bg-[#FBFCFB]"
                      >
                        {/* Applicant */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EAF0EC] text-sm font-bold text-forest">
                              {applicantName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <p className="max-w-45 truncate text-sm font-semibold text-[#26382F]">
                              {applicantName}
                            </p>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-4">
                          <p className="max-w-55 truncate text-sm text-[#536159]">
                            {email}
                          </p>
                        </td>

                        {/* Message */}
                        <td className="px-4 py-4">
                          <p
                            className="max-w-60 truncate text-sm text-[#77837C]"
                            title={adminMessage}
                          >
                            {adminMessage}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                              status
                            )}`}
                          >
                            {formatStatus(status)}
                          </span>
                        </td>

                        {/* Submitted */}
                        <td className="px-4 py-4 text-sm text-[#69766E]">
                          {application.createdAt
                            ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/owner-applications/${applicationId}`
                                )
                              }
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DDE4DE] bg-white px-3 text-xs font-semibold text-[#536159] transition hover:bg-[#F6F8F6] hover:text-forest"
                            >
                              <Eye size={15} />
                              View
                            </button>

                            {status === "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  disabled={
                                    updatingId === applicationId
                                  }
                                  onClick={() => {
                                    setError("");
                                    setRequestingDocumentsId(
                                      applicationId
                                    );
                                  }}
                                  className="inline-flex size-9 items-center justify-center rounded-lg border border-sky-200 bg-white text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Request more documents"
                                >
                                  <FileWarning size={15} />
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    updatingId === applicationId
                                  }
                                  onClick={() =>
                                    updateApplication(
                                      applicationId,
                                      "APPROVED"
                                    )
                                  }
                                  className="inline-flex size-9 items-center justify-center rounded-lg bg-forest text-white transition hover:bg-[#214A3D] disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Approve"
                                >
                                  <Check size={15} />
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    updatingId === applicationId
                                  }
                                  onClick={() => {
                                    setError("");
                                    setRejectingId(
                                      applicationId
                                    );
                                  }}
                                  className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Reject"
                                >
                                  <X size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          isSubmitting={
            updatingId === requestingDocumentsId
          }
          error={error}
          onCancel={() => {
            if (updatingId !== requestingDocumentsId) {
              setRequestingDocumentsId(null);
              setError("");
            }
          }}
          onReject={(message) =>
            updateApplication(
              requestingDocumentsId,
              "NEED_MORE_DOCUMENTS",
              message
            )
          }
        />
      )}
    </section>
  );
};

export default OwnerApplications;
