import { useEffect, useId, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import useAuthStore from "../../stores/authStore.js";
import { getMyProfile, updateMyProfile } from "../../services/profileService.js";
import "../../styles/components/edit-profile-modal.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getErrorMessage = (error) => {
  const message = error.response?.data?.message;
  if (message && typeof message === "object") {
    return Object.values(message).flat().find(Boolean);
  }
  return message || error.message || "Unable to update your profile.";
};

const EditProfileModal = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const titleId = useId();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ username: "", firstName: "", lastName: "", phone: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;
    // This state reset is tied to the external open/closed modal lifecycle.
    // oxlint-disable-next-line react/set-state-in-effect
    setError("");
    setImageFile(null);
    setPreviewUrl("");
    setIsLoading(true);
    getMyProfile()
      .then((profile) => {
        if (!active) return;
        setForm({
          username: profile.user.username || "",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phone: profile.phone || "",
        });
        setAuth({ token, user: { ...user, profile } });
      })
      .catch((requestError) => active && setError(getErrorMessage(requestError)))
      .finally(() => active && setIsLoading(false));

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      active = false;
      document.removeEventListener("keydown", handleKeyDown);
    };
    // Opening the modal intentionally refreshes the server profile only once.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (!isOpen) return null;

  const closeModal = () => {
    if (!isSaving) onClose();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Profile image must be a JPEG, PNG, or WebP file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Profile image must not exceed 5 MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving || isLoading) return;
    setIsSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("username", form.username.trim());
      payload.append("firstName", form.firstName.trim());
      payload.append("lastName", form.lastName.trim());
      payload.append("phone", form.phone.trim());
      if (imageFile) payload.append("profileImage", imageFile);
      const profile = await updateMyProfile(payload);
      setAuth({ token, user: { ...user, username: profile.user.username, profile } });
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl = previewUrl || user?.profile?.profileImageUrl;
  const fallback = (form.firstName || user?.username || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="edit-profile-overlay" onMouseDown={closeModal}>
      <section className="edit-profile-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
        <header className="edit-profile-header">
          <div><h2 id={titleId}>Edit profile</h2><p>Update how your profile appears across RoomShare.</p></div>
          <button type="button" onClick={closeModal} disabled={isSaving} aria-label="Close edit profile"><X size={22} /></button>
        </header>
        <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
          <div className="edit-profile-avatar-section">
            <div className="edit-profile-avatar">{avatarUrl ? <img src={avatarUrl} alt="Profile preview" /> : <span>{fallback}</span>}</div>
            <div><button type="button" className="edit-profile-photo-button" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isSaving}><Camera size={17} />Choose photo</button><small>JPEG, PNG, or WebP · Maximum 5 MB</small></div>
            <input ref={fileInputRef} className="edit-profile-file-input" type="file" accept={ALLOWED_IMAGE_TYPES.join(",")} onChange={handleImageChange} />
          </div>
          <div className="edit-profile-fields">
            <label><span>Username</span><input value={form.username} minLength={3} required onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} disabled={isLoading || isSaving} /></label>
            <label><span>Email</span><input type="email" value={user?.email || ""} readOnly aria-readonly="true" /><small>Your login email cannot be changed here.</small></label>
            <label><span>First name</span><input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} disabled={isLoading || isSaving} /></label>
            <label><span>Last name</span><input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} disabled={isLoading || isSaving} /></label>
            <label className="edit-profile-phone"><span>Phone</span><input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} disabled={isLoading || isSaving} /></label>
          </div>
          {isLoading && <p className="edit-profile-status" role="status">Loading profile…</p>}
          {error && <p className="edit-profile-error" role="alert">{error}</p>}
          <footer className="edit-profile-actions"><button type="button" className="edit-profile-cancel" onClick={closeModal} disabled={isSaving}>Cancel</button><button type="submit" className="edit-profile-save" disabled={isLoading || isSaving}>{isSaving ? "Saving…" : "Save changes"}</button></footer>
        </form>
      </section>
    </div>
  );
};

export default EditProfileModal;
