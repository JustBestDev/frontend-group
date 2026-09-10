import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { imagePreviewActionForKey } from "../../utils/imagePreview.js";

const PropertyImageLightbox = ({
  images,
  index,
  propertyTitle,
  onClose,
  onNext,
  onPrevious,
}) => {
  const closeButtonRef = useRef(null);
  const image = images[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      const action = imagePreviewActionForKey(event.key);
      if (!action) return;
      event.preventDefault();
      if (action.type === "close") onClose();
      if (action.type === "next") onNext();
      if (action.type === "previous") onPrevious();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${propertyTitle} image preview`}
      className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-3 sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute right-3 top-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-white/95 text-ink shadow-lg transition hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
      >
        <X size={22} />
      </button>

      <figure className="grid max-h-full max-w-full place-items-center gap-3">
        <img
          src={image.imageUrl}
          alt={`${propertyTitle}, image ${index + 1} of ${images.length}`}
          className="max-h-[calc(100vh-7rem)] max-w-full rounded-xl object-contain shadow-2xl"
        />
        <figcaption className="text-sm font-semibold text-white" aria-live="polite">
          {index + 1} of {images.length}
        </figcaption>
      </figure>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            aria-label="View previous property image"
            className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/95 text-ink shadow-lg transition hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
          >
            <ChevronLeft size={25} />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="View next property image"
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/95 text-ink shadow-lg transition hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
          >
            <ChevronRight size={25} />
          </button>
        </>
      )}
    </div>
  );
};

export default PropertyImageLightbox;
