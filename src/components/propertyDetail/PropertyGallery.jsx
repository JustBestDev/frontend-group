import { useState } from "react";
import { Building2, Camera, Sparkles } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox.jsx";

const PropertyGallery = ({ property, galleryImages }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const visibleImages = galleryImages.slice(0, 5);

  const openPhoto = (index) => {
    setActivePhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  if (visibleImages.length === 0) {
    return (
      <section className="mb-10 grid min-h-80 place-items-center rounded-[20px] bg-[#e9e6dc] text-center text-muted-copy shadow-sm md:min-h-110">
        <div><Building2 className="mx-auto mb-3 size-10 text-sage-dark" /><p className="text-sm font-semibold">No property photos provided</p></div>
      </section>
    );
  }

  return (
    <>
      <section className={`relative mb-10 grid h-85 gap-1.5 overflow-hidden rounded-[20px] bg-[#e5e2d9] shadow-[0_16px_36px_rgba(50,66,54,.1)] md:h-125 ${visibleImages.length > 1 ? "md:grid-cols-[1.35fr_.95fr]" : ""}`}>
        <button type="button" onClick={() => openPhoto(0)} className="group relative min-h-0 cursor-pointer overflow-hidden bg-[#dedbd1] text-left">
          <img src={visibleImages[0]} alt={property.title || property.name || "Property"} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-forest shadow-sm backdrop-blur"><Sparkles className="size-3.5 text-sage-dark" />Featured photo</span>
        </button>

        {visibleImages.length > 1 && (
          <div className="hidden min-h-0 grid-cols-2 gap-1.5 md:grid">
            {visibleImages.slice(1).map((image, offset) => (
              <button key={image + offset} type="button" onClick={() => openPhoto(offset + 1)} className={`group relative min-h-0 cursor-pointer overflow-hidden bg-[#dedbd1] ${visibleImages.length === 2 ? "col-span-2" : ""}`}>
                <img src={image} alt={`Property photo ${offset + 2}`} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
            ))}
          </div>
        )}

        <button type="button" onClick={() => openPhoto(0)} className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-bold text-forest shadow-lg backdrop-blur transition hover:bg-white">
          <Camera className="size-4" />View All Photos ({galleryImages.length})
        </button>
      </section>

      {isPhotoModalOpen && <PhotoLightbox galleryImages={galleryImages} activePhotoIndex={activePhotoIndex} setActivePhotoIndex={setActivePhotoIndex} onClose={() => setIsPhotoModalOpen(false)} />}
    </>
  );
};

export default PropertyGallery;
