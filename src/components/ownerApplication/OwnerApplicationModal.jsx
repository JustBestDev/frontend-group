import { useState } from "react";
import { ExternalLink, FileText, Upload, X } from "lucide-react";
import { resubmitOwnerApplication, submitOwnerApplication } from "../../services/ownerApplicationService.js";
import { updateMyProfile } from "../../services/profileService.js";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const STATUS_CONTENT = {
  PENDING: { label: "Under review", description: "Your documents are being reviewed. You cannot change them during review." },
  NEED_MORE_DOCUMENTS: { label: "Action required", description: "Additional documents are required before your application can be reviewed." },
  REJECTED: { label: "Rejected", description: "Your owner application was not approved." },
  APPROVED: { label: "Approved", description: "Your owner application has been approved." },
};

const formatDate = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not available";
const formatFileSize = (bytes) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
const getBackendMessage = (error) => {
  const message = error.response?.data?.message;
  if (message && typeof message === "object") return Object.values(message).flat().find(Boolean);
  return message || error.response?.data?.error || error.message;
};

const OwnerApplicationModal = ({ isOpen, onClose, application, onSubmitted }) => {
  const [files, setFiles] = useState([]);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [success, setSuccess] = useState("");
  const isAppending = application?.status === "NEED_MORE_DOCUMENTS";
  const maximumNewFiles = isAppending
    ? Math.max(0, MAX_FILES - (application.documents?.length || 0))
    : MAX_FILES;

  if (!isOpen) return null;
  const closeModal = () => {
    if (isSubmitting) return;
    setPhone(""); setFiles([]); setError(""); setSuccess(""); setIsSubmitted(false); onClose();
  };
  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = ""; setError("");
    if (files.length + selected.length > maximumNewFiles) {
      return setError(isAppending
        ? `You can add ${maximumNewFiles} more document${maximumNewFiles === 1 ? "" : "s"}; an application can have at most 5.`
        : "You can upload up to 5 documents.");
    }
    const invalid = selected.find((file) => !ALLOWED_TYPES.includes(file.type));
    if (invalid) return setError(`${invalid.name} is not a JPEG, PNG, WebP, or PDF file.`);
    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) return setError(`${oversized.name} is larger than 5 MB.`);
    setFiles((current) => [...current, ...selected]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const normalizedPhone = phone.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(normalizedPhone)) return setError("Please enter a valid 10-digit phone number.");
    if (!files.length) return setError("Please select at least one document.");
    setIsSubmitting(true); setError("");
    try {
      await updateMyProfile({ phone: normalizedPhone });
      await submitOwnerApplication(files);
      setIsSubmitted(true);
      await onSubmitted?.();
    } catch (requestError) {
      setError(requestError.response?.status === 409 ? "You already have an owner application." : getBackendMessage(requestError) || "Unable to submit your application. Please try again.");
    } finally { setIsSubmitting(false); }
  };
  const handleResubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!files.length) return setError(isAppending ? "Please select at least one additional document." : "Please select at least one replacement document.");
    setIsSubmitting(true); setError(""); setSuccess("");
    try {
      await resubmitOwnerApplication(files);
      setFiles([]);
      setSuccess("Documents submitted successfully. Your application is now under review.");
      await onSubmitted?.();
    } catch (requestError) {
      setError(getBackendMessage(requestError) || "Unable to resubmit your documents. Please try again.");
    } finally { setIsSubmitting(false); }
  };
  const statusContent = application && (STATUS_CONTENT[application.status] || { label: application.status, description: "This application has an unknown status." });

  return <div className="owner-application-overlay" onMouseDown={closeModal}>
    <section className="owner-application-modal" role="dialog" aria-modal="true" aria-labelledby="owner-application-title" onMouseDown={(event) => event.stopPropagation()}>
      <header className="owner-application-header"><div><h2 id="owner-application-title">{application ? "Owner application" : "List your property"}</h2><p>{application ? "Application details and review status." : "Submit documents to apply for an owner account."}</p></div><button type="button" onClick={closeModal} disabled={isSubmitting} aria-label="Close"><X size={22} /></button></header>
      <div className="owner-application-content">
        {application ? <div className="owner-application-status-details">
          <div className={`owner-application-status-card status-${application.status.toLowerCase().replaceAll("_", "-")}`}><span>Current status</span><strong>{statusContent.label}</strong><p>{statusContent.description}</p></div>
          {(application.rejectReason || application.adminMessage) && <div className="owner-application-admin-message"><strong>Admin message</strong><p>{application.rejectReason || application.adminMessage}</p></div>}
          <dl className="owner-application-metadata"><div><dt>Submitted</dt><dd>{formatDate(application.createdAt)}</dd></div><div><dt>Phone number</dt><dd>{application.phone || "Not available"}</dd></div></dl>
          <section className="owner-application-document-section"><h3>{["NEED_MORE_DOCUMENTS", "REJECTED"].includes(application.status) ? "Previously submitted documents" : "Submitted documents"}</h3>{application.documents?.length ? <ul className="owner-application-files">{application.documents.map((document, index) => <li key={document.id}><FileText size={19} aria-hidden="true" /><span><strong>Document {index + 1}</strong><small>Submitted {formatDate(document.createdAt)}</small></span>{document.signedUrl && <a href={document.signedUrl} target="_blank" rel="noreferrer" aria-label={`View document ${index + 1}`}><ExternalLink size={17} /></a>}</li>)}</ul> : <p className="owner-application-empty">No documents are available.</p>}</section>
          {["NEED_MORE_DOCUMENTS", "REJECTED"].includes(application.status) && <form className="owner-application-resubmit" onSubmit={handleResubmit} noValidate>
            <p>{isAppending ? `Add only the documents requested by the review team. Your ${application.documents?.length || 0} previous document${application.documents?.length === 1 ? "" : "s"} will be kept.` : "Select the complete corrected document set. A successful resubmission will replace all previously submitted documents."}</p>
            <label className="owner-application-upload" htmlFor="owner-resubmit-documents"><Upload size={28} /><strong>{isAppending ? "Select additional documents" : "Select replacement documents"}</strong><span>JPEG, PNG, WebP, or PDF · Up to {maximumNewFiles} file{maximumNewFiles === 1 ? "" : "s"} · 5 MB each</span></label>
            <input id="owner-resubmit-documents" className="owner-application-file-input" type="file" multiple accept={ALLOWED_TYPES.join(",")} onChange={handleFiles} disabled={isSubmitting || maximumNewFiles === 0} />
            {maximumNewFiles === 0 && <p className="owner-application-error">This application already has the maximum of 5 documents. Contact support if another file was requested.</p>}
            {!!files.length && <ul className="owner-application-files" aria-label={isAppending ? "New additional documents" : "New replacement documents"}>{files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`}><FileText size={19} /><span><strong>{file.name}</strong><small>{formatFileSize(file.size)}</small></span><button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} disabled={isSubmitting} aria-label={`Remove ${file.name}`}><X size={17} /></button></li>)}</ul>}
            {error && <p className="owner-application-error" role="alert">{error}</p>}
            <button type="submit" className="owner-application-submit" disabled={isSubmitting || !files.length}>{isSubmitting ? "Uploading..." : isAppending ? "Submit additional documents" : "Resubmit application"}</button>
          </form>}
          {success && <p className="owner-application-success-message" role="status">{success}</p>}
          <button type="button" className="owner-application-done" onClick={closeModal}>Done</button>
        </div> : isSubmitted ? <div className="owner-application-success" role="status"><div><FileText size={30} /></div><h3>Application submitted</h3><p>Your application was sent successfully and is waiting for review.</p><button type="button" onClick={closeModal}>Done</button></div> :
          <form onSubmit={handleSubmit} noValidate>
            <div className="owner-application-phone-field"><label htmlFor="owner-phone">Contact phone number</label><input id="owner-phone" type="tel" inputMode="numeric" placeholder="0812345678" value={phone} onChange={(event) => { setPhone(event.target.value); setError(""); }} disabled={isSubmitting} required /></div>
            <label className="owner-application-upload" htmlFor="owner-documents"><Upload size={28} /><strong>Select documents</strong><span>JPEG, PNG, WebP, or PDF · Up to 5 files · 5 MB each</span></label>
            <input id="owner-documents" className="owner-application-file-input" type="file" multiple accept={ALLOWED_TYPES.join(",")} onChange={handleFiles} disabled={isSubmitting} aria-describedby="owner-document-help" />
            <p id="owner-document-help" className="owner-application-help">Select at least one document that helps verify your application.</p>
            {!!files.length && <ul className="owner-application-files" aria-label="Selected documents">{files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`}><FileText size={19} /><span><strong>{file.name}</strong><small>{formatFileSize(file.size)}</small></span><button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} disabled={isSubmitting} aria-label={`Remove ${file.name}`}><X size={17} /></button></li>)}</ul>}
            {error && <p className="owner-application-error" role="alert">{error}</p>}
            <div className="owner-application-actions"><button type="button" className="owner-application-skip" onClick={closeModal} disabled={isSubmitting}>Skip for now</button><button type="submit" className="owner-application-submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit application"}</button></div>
          </form>}
      </div>
    </section>
  </div>;
};

export default OwnerApplicationModal;
