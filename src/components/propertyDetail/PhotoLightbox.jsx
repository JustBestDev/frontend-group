import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PhotoLightbox = ({ galleryImages, activePhotoIndex, setActivePhotoIndex, onClose }) => {

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Modal Header */}
      <div
        className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium">
          Photo {activePhotoIndex + 1} of {galleryImages.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Active Image with Navigation */}
      <div
        className="relative flex items-center justify-center max-w-5xl w-full mx-auto my-auto max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() =>
            setActivePhotoIndex(
              (prev) =>
                (prev - 1 + galleryImages.length) % galleryImages.length,
            )
          }
          className="absolute left-2 sm:-left-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer z-10"
          title="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={galleryImages[activePhotoIndex]}
          alt={`Photo ${activePhotoIndex + 1}`}
          className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
        />

        <button
          type="button"
          onClick={() =>
            setActivePhotoIndex((prev) => (prev + 1) % galleryImages.length)
          }
          className="absolute right-2 sm:-right-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer z-10"
          title="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnails Strip */}
      <div
        className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-4xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {galleryImages.map((imgUrl, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setActivePhotoIndex(i)}
            className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${activePhotoIndex === i
              ? "border-white scale-105 shadow-md"
              : "border-transparent opacity-60 hover:opacity-100"
              }`}
          >
            <img
              src={imgUrl}
              alt={`Thumb ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoLightbox;
