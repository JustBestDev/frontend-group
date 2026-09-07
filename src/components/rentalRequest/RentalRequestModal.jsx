import { CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import api, { getApiErrorMessage } from "../../services/api.js";

const RentalRequestModal = ({
  propertyId,
  roomId,
  communityPostId,
  targetName,
  onClose,
  onSubmitted,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/rental-requests", {
        propertyId: Number(propertyId),
        ...(roomId ? { roomId: Number(roomId) } : {}),
        ...(communityPostId
          ? { communityPostId: Number(communityPostId) }
          : {}),
        startDate,
        ...(endDate ? { endDate } : {}),
      });
      setSubmitted(true);
      onSubmitted?.();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to submit rental request"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <section
        className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rental-request-title"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="rental-request-title" className="font-serif text-2xl font-bold text-ink">
              Request to Rent
            </h2>
            <p className="mt-1 text-sm text-muted-copy">{targetName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-2 text-muted-copy transition hover:bg-cream hover:text-ink disabled:opacity-50"
            aria-label="Close rental request form"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto text-sage-dark" size={44} />
            <p className="font-semibold text-ink">Your rental request is pending owner review.</p>
            <Link
              to="/rental-requests"
              className="inline-flex rounded-xl bg-sage-dark px-5 py-3 font-bold text-white transition hover:brightness-95"
            >
              View My Rental Requests
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              Start date
              <input
                type="date"
                required
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-xl border border-line bg-cream px-3.5 py-3 outline-none focus:border-sage-dark"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              End date <span className="font-normal text-muted-copy">(optional)</span>
              <input
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-xl border border-line bg-cream px-3.5 py-3 outline-none focus:border-sage-dark"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-[#fde8e6] px-3.5 py-3 text-sm text-danger" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-dark px-4 py-3.5 font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="animate-spin" size={18} />}
              {submitting ? "Submitting..." : "Submit Rental Request"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default RentalRequestModal;
