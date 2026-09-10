import { Check, Loader2, X } from "lucide-react";

const RentalRequestActions = ({ requestId, reviewingId, onReview }) => {
  const reviewing = reviewingId === requestId;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onReview(requestId, "REJECT")}
        disabled={reviewingId !== null}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-danger px-4 py-2.5 text-sm font-bold text-danger transition hover:bg-[#fde8e6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X size={17} /> Reject
      </button>
      <button
        type="button"
        onClick={() => onReview(requestId, "ACCEPT")}
        disabled={reviewingId !== null}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sage-dark px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {reviewing ? (
          <Loader2 className="animate-spin" size={17} />
        ) : (
          <Check size={17} />
        )}
        Accept request
      </button>
    </div>
  );
};

export default RentalRequestActions;
