import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { submitOwnerApplication } from "../../services/ownerApplicationService.js";
import { updateMyProfile } from "../../services/profileService.js";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getBackendMessage = (error) => {
  const message = error.response?.data?.message;

  if (message && typeof message === "object") {
    return Object.values(message).flat().find(Boolean);
  }

  return message || error.response?.data?.error || error.message;
};

const OwnerApplicationModal = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const closeModal = () => {
    if (!isSubmitting) {
      setPhone("");
      setFiles([]);
      setError("");
      setIsSubmitted(false);
      onClose();
    }
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    setError("");

    if (files.length + selectedFiles.length > MAX_FILES) {
      setError("You can upload up to 5 documents.");
      return;
    }

    const invalidType = selectedFiles.find(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );
    if (invalidType) {
      setError(`${invalidType.name} is not a JPEG, PNG, WebP, or PDF file.`);
      return;
    }

    const oversized = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`${oversized.name} is larger than 5 MB.`);
      return;
    }

    setFiles((current) => [...current, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedPhone = phone.replace(/\D/g, "");

    if (!/^0\d{9}$/.test(normalizedPhone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (files.length === 0) {
      setError("Please select at least one document.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    let isSubmittingApplication = false;

    try {
      await updateMyProfile({
        phone: normalizedPhone,
      });

      isSubmittingApplication = true;
      await submitOwnerApplication(files);
      setIsSubmitted(true);
    } catch (requestError) {
      if (
        isSubmittingApplication &&
        requestError.response?.status === 409
      ) {
        setError(
          "You already have an application that is pending or approved.",
        );
      } else {
        setError(
          getBackendMessage(requestError) ||
            "Unable to submit your application. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="owner-application-overlay" onMouseDown={closeModal}>
      <section
        className="owner-application-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="owner-application-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="owner-application-header">
          <div>
            <h2 id="owner-application-title">List your property</h2>
            <p>Submit documents to apply for an owner account.</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </header>

        <div className="owner-application-content">
          {isSubmitted ? (
            <div className="owner-application-success" role="status">
              <div>
                <FileText size={30} />
              </div>
              <h3>Application submitted</h3>
              <p>
                Your application was sent successfully and is waiting for
                review.
              </p>
              <button type="button" onClick={closeModal}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="owner-application-phone-field">
                <label htmlFor="owner-phone">Contact phone number</label>
                <input
                  id="owner-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="0812345678"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                  }}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <label
                className="owner-application-upload"
                htmlFor="owner-documents"
              >
                <Upload size={28} />
                <strong>Select documents</strong>
                <span>JPEG, PNG, WebP, or PDF · Up to 5 files · 5 MB each</span>
              </label>
              <input
                id="owner-documents"
                className="owner-application-file-input"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFiles}
                disabled={isSubmitting}
                aria-describedby="owner-document-help"
              />
              <p id="owner-document-help" className="owner-application-help">
                Select at least one document that helps verify your application.
              </p>

              {files.length > 0 && (
                <ul
                  className="owner-application-files"
                  aria-label="Selected documents"
                >
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.lastModified}-${index}`}>
                      <FileText size={19} aria-hidden="true" />
                      <span>
                        <strong>{file.name}</strong>
                        <small>{formatFileSize(file.size)}</small>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={isSubmitting}
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={17} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {error && (
                <p className="owner-application-error" role="alert">
                  {error}
                </p>
              )}

              <div className="owner-application-actions">
                <button
                  type="button"
                  className="owner-application-skip"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  className="owner-application-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default OwnerApplicationModal;
