import { useId, useRef } from "react";
import { Camera, X } from "lucide-react";
import useProfileEditor from "../../hooks/useProfileEditor.js";
import "../../styles/components/edit-profile-modal.css";

const todayDateInputValue = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const EditProfileModal = ({ isOpen, onClose }) => {
  const titleId = useId();
  const fileInputRef = useRef(null);
  const {
    user, ALLOWED_IMAGE_TYPES,
    form, setForm, error, isLoading, isSaving, zodiac, closeModal,
    handleImageChange, handleSubmit, avatarUrl, hasChanges, fallback,
  } = useProfileEditor(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="edit-profile-overlay" onMouseDown={closeModal}>
      <section
        className="edit-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="edit-profile-header">
          <div>
            <h2 id={titleId}>Edit profile</h2>
            <p>Update how your profile appears across RoomHub.</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={isSaving}
            aria-label="Close edit profile"
          >
            <X size={22} />
          </button>
        </header>
        <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
          <div className="edit-profile-avatar-section">
            <div className="edit-profile-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile preview" />
              ) : (
                <span>{fallback}</span>
              )}
            </div>
            <div className="edit-profile-avatar-info">
  <div className="edit-profile-identity">
    <strong>
      {form.username || user?.username || "Your profile"}
    </strong>

    <span>{user?.email || ""}</span>
  </div>

  <button
    type="button"
    className="edit-profile-photo-button"
    onClick={() => fileInputRef.current?.click()}
    disabled={isLoading || isSaving}
  >
    <Camera size={17} />
    Choose photo
  </button>

  <small>JPEG, PNG, or WebP · Maximum 5 MB</small>
</div>
            <input
              ref={fileInputRef}
              className="edit-profile-file-input"
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={handleImageChange}
            />
          </div>
          <section className="edit-profile-section">
            <h3>Basic information</h3>
            <div className="edit-profile-fields">
              <label>
                <span>Username</span>
                <input
                  value={form.username}
                  minLength={3}
                  required
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  aria-readonly="true"
                />
              </label>
              <label>
                <span>First name</span>
                <input
                  value={form.firstName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  value={form.lastName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
              <label className="edit-profile-full-width">
                <span>Phone</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
            </div>
          </section>
          <section className="edit-profile-section">
            <h3>About you</h3>
            <div className="edit-profile-fields">
              <label className="edit-profile-full-width">
                <span>Bio</span>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.bio}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
              <label>
                <span>Gender</span>
                <select
                  value={form.gender}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gender: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                >
                  <option value="">Prefer not to specify</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
              <label>
                <span>Birthdate</span>
                <input
                  type="date"
                  min="1900-01-01"
                  max={todayDateInputValue()}
                  value={form.birthdate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      birthdate: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
              <label>
                <span>Occupation</span>
                <input
                  maxLength={191}
                  value={form.occupation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      occupation: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
              <div className="edit-profile-zodiac">
                <span>Zodiac sign</span>
                <div className="edit-profile-zodiac-value" aria-live="polite">
                  {zodiac ? (
                    <>
                      <span className="edit-profile-zodiac-symbol" aria-hidden="true">
                        {zodiac.symbol}
                      </span>
                      <strong>{zodiac.name}</strong>
                    </>
                  ) : (
                    <span>Not available</span>
                  )}
                </div>
              </div>
              <label className="edit-profile-full-width">
                <span>Current address</span>
                <textarea
                  rows={2}
                  maxLength={191}
                  value={form.currentAddress}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      currentAddress: event.target.value,
                    }))
                  }
                  disabled={isLoading || isSaving}
                />
              </label>
            </div>
          </section>
          {isLoading && (
            <p className="edit-profile-status" role="status">
              Loading profile…
            </p>
          )}
          {error && (
            <p className="edit-profile-error" role="alert">
              {error}
            </p>
          )}
          <footer className="edit-profile-actions">
            <button
              type="button"
              className="edit-profile-cancel"
              onClick={closeModal}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-profile-save"
              disabled={isLoading || isSaving || !hasChanges}
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default EditProfileModal;
