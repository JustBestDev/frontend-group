import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

const RejectReasonModal = ({
  entityLabel,
  isSubmitting,
  error,
  onCancel,
  onReject,
  title,
  description,
  fieldLabel = "Rejection reason",
  placeholder = "Enter the reason that will be sent with this rejection",
  submitLabel = "Reject",
  submittingLabel = "Rejecting...",
}) => {
  const [reason, setReason] = useState("");
  const submissionStarted = useRef(false);
  const titleId = useId();
  const descriptionId = useId();
  const trimmedReason = reason.trim();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onCancel]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !trimmedReason ||
      isSubmitting ||
      submissionStarted.current
    ) {
      return;
    }

    submissionStarted.current = true;
    try {
      await onReject(trimmedReason);
    } finally {
      submissionStarted.current = false;
    }
  };

  return (
    <div className="reject-modal-overlay">
      <section
        className="reject-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="reject-modal-header">
          <div>
            <h2 id={titleId}>{title || `Reject ${entityLabel}`}</h2>
            <p id={descriptionId}>
              {description || `Please confirm this decision and explain why the ${entityLabel} is being rejected.`}
            </p>
          </div>

          <button
            type="button"
            className="reject-modal-close"
            aria-label="Close rejection dialog"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor={`${titleId}-reason`}>
            {fieldLabel}
          </label>
          <textarea
            id={`${titleId}-reason`}
            autoFocus
            rows={5}
            value={reason}
            disabled={isSubmitting}
            placeholder={placeholder}
            onChange={(event) => setReason(event.target.value)}
          />

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <div className="reject-modal-actions">
            <button
              type="button"
              className="reject-modal-cancel"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="reject-modal-submit"
              disabled={!trimmedReason || isSubmitting}
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default RejectReasonModal;
