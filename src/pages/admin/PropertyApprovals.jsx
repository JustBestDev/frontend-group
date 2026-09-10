import {
  Building2,
  Check,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import usePropertyApprovals from "../../hooks/usePropertyApprovals.js";
import RejectReasonModal from "../../components/admin/RejectReasonModal";
import roomHubIcon from "../../assets/roomhub-icon.svg";

const PropertyApprovals = () => {

  const navigate = useNavigate();

  const {
    setError,
    loading,
    updatingId,
    error,
    rejectingId,
    setRejectingId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    fetchProperties,
    updatePublishStatus,
    filteredProperties,
    pendingCount,
    approvedCount,
    rejectedCount,
  } = usePropertyApprovals();

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#DCE5DF] border-t-forest" />

          <p className="mt-4 text-sm font-medium text-[#7D8981]">
            Loading properties...
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
            Property approvals
          </h1>

          <p className="mt-1.5 text-sm text-[#7B8780]">
            Review property listings before publishing them on RoomHub.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProperties}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DDE4DE] bg-white px-4 text-sm font-semibold text-[#45554C] shadow-sm transition hover:bg-[#F6F8F6]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Compact summary */}
      <div className="grid gap-3 sm:grid-cols-3">
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
            Rejected
          </p>
          <p className="mt-1 text-xl font-bold text-red-700">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E4E9E4] bg-white p-3 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA39D]"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by property, owner or location..."
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
      {filteredProperties.length === 0 ? (
        <div className="rounded-2xl border border-[#E4E9E4] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
            <Building2 size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-[#26372E]">
            No properties found
          </h2>

          <p className="mt-1 text-sm text-[#879189]">
            No property listings match the current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead className="bg-[#F7F9F7]">
                <tr className="border-b border-[#E9EDE9]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Property
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Owner
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Rent type
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Price
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEF1EE]">
                {filteredProperties.map((property) => {
                  const propertyId =
                    property.id || property.propertyId;

                  const owner =
                    property.owner || property.user || {};

                  const address =
                    property.address?.fullAddress ||
                    property.address?.district ||
                    property.location ||
                    property.city ||
                    "Address not provided";

                  const image =
                    property.images?.[0]?.imageUrl ||
                    property.images?.[0]?.url ||
                    property.imageUrl;

                  const publishStatus =
                    property.publishStatus || "PENDING";

                  const propertyName =
                    property.title ||
                    property.name ||
                    "Untitled property";

                  return (
                    <tr
                      key={propertyId}
                      className="transition hover:bg-[#FBFCFB]"
                    >
                      {/* Property */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-[#EEF2EE]">
                            {image ? (
                              <img
                                src={image}
                                alt={propertyName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full place-items-center bg-[#EEF3EF]">
                                <img
                                  src={roomHubIcon}
                                  alt="RoomHub"
                                  className="h-8 w-auto opacity-60"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-65 truncate text-sm font-semibold text-[#26382F]">
                              {propertyName}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A968E]">
                              <MapPin size={13} className="shrink-0" />

                              <span className="max-w-62.5 truncate">
                                {address}
                              </span>
                            </div>

                            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#A0AAA4]">
                              {property.propertyType ||
                                property.type ||
                                "Property"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-4">
                        <p className="max-w-42.5 truncate text-sm font-medium text-[#394B42]">
                          {owner.username ||
                            owner.email ||
                            property.ownerName ||
                            "Unknown"}
                        </p>
                      </td>

                      {/* Rent type */}
                      <td className="px-4 py-4 text-sm font-medium text-[#536159]">
                        {property.rentType || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-sm font-semibold text-[#33463C]">
                        {property.price
                          ? `฿${Number(
                            property.price
                          ).toLocaleString()}`
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            publishStatus
                          )}`}
                        >
                          {publishStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/properties/${propertyId}`)
                            }
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DDE4DE] bg-white px-3 text-xs font-semibold text-[#536159] transition hover:bg-[#F6F8F6] hover:text-forest"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          {/* Approve / Reject เฉพาะ PENDING */}
                          {publishStatus === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={updatingId === propertyId}
                                onClick={() =>
                                  updatePublishStatus(propertyId, "APPROVED")
                                }
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-forest px-3 text-xs font-semibold text-white transition hover:bg-[#214A3D] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Check size={14} />
                                Approve
                              </button>

                              <button
                                type="button"
                                disabled={updatingId === propertyId}
                                onClick={() => {
                                  setError("");
                                  setRejectingId(propertyId);
                                }}
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <X size={14} />
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
        </div>
      )}

      {rejectingId !== null && (
        <RejectReasonModal
          entityLabel="property"
          isSubmitting={updatingId === rejectingId}
          error={error}
          onCancel={() => {
            if (updatingId !== rejectingId) {
              setRejectingId(null);
              setError("");
            }
          }}
          onReject={(rejectReason) =>
            updatePublishStatus(
              rejectingId,
              "REJECTED",
              rejectReason
            )
          }
        />
      )}
    </section>
  );
};

export default PropertyApprovals;
