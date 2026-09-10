import { useEffect, useState } from "react";
import useImagePreview from "./useImagePreview.js";
import useAuthStore from "../stores/authStore.js";
import { getMyProfile, updateMyProfile } from "../services/profileService.js";
import { getZodiacFromBirthdate } from "../utils/zodiac.js";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EMPTY_FORM = {
  username: "",
  firstName: "",
  lastName: "",
  phone: "",
  bio: "",
  gender: "",
  birthdate: "",
  occupation: "",
  currentAddress: "",
};

const toDateInputValue = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";
const getErrorMessage = (error) => {
  const message = error.response?.data?.message;
  if (message && typeof message === "object") {
    return Object.values(message).flat().find(Boolean);
  }
  return message || error.message || "Unable to update your profile.";
};



export default function useProfileEditor(isOpen, onClose) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const previewUrl = useImagePreview(isOpen ? imageFile : null);
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
    setIsLoading(true);
    getMyProfile()
      .then((profile) => {
        if (!active) return;
        const loadedForm = {
          username: profile.user.username || "",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
          gender: profile.gender || "",
          birthdate: toDateInputValue(profile.birthdate),
          occupation: profile.occupation || "",
          currentAddress: profile.currentAddress || "",
        };
        setForm(loadedForm);
        setInitialForm(loadedForm);
        setAuth({ token, user: { ...user, profile } });
      })
      .catch(
        (requestError) => active && setError(getErrorMessage(requestError)),
      )
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

  const zodiac = getZodiacFromBirthdate(form.birthdate);

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving || isLoading || !hasChanges) return;
    setIsSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("username", form.username.trim());
      payload.append("firstName", form.firstName.trim());
      payload.append("lastName", form.lastName.trim());
      payload.append("phone", form.phone.trim());
      payload.append("bio", form.bio.trim());
      payload.append("gender", form.gender);
      payload.append("birthdate", form.birthdate);
      payload.append("occupation", form.occupation.trim());
      payload.append("currentAddress", form.currentAddress.trim());
      if (imageFile) payload.append("profileImage", imageFile);
      const profile = await updateMyProfile(payload);
      setAuth({
        token,
        user: { ...user, username: profile.user.username, profile },
      });
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl = previewUrl || user?.profile?.profileImageUrl;
  const hasChanges =
    JSON.stringify(form) !== JSON.stringify(initialForm) || Boolean(imageFile);
  const fallback = (form.firstName || user?.username || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return {
    user,
    ALLOWED_IMAGE_TYPES,
    form,
    setForm,
    error,
    isLoading,
    isSaving,
    zodiac,
    closeModal,
    handleImageChange,
    handleSubmit,
    avatarUrl,
    hasChanges,
    fallback,
  };
}
