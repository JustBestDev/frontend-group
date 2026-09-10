import { useState } from "react";
import { Camera, Sparkles } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox.jsx";

const PropertyGallery = ({ property, galleryImages }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  return (
    <>
      <section className="relative rounded-2xl overflow-hidden bg-[#e5e2d9] border border-[#e1e5dd] shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:h-105 p-2">
          {/* Main Featured Image */}
          <div
            className="md:col-span-2 md:row-span-2 relative h-70 md:h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setActivePhotoIndex(0);
              setIsPhotoModalOpen(true);
            }}
          >
            <img
              src={galleryImages[0]}
              alt={property.title || "Property"}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="absolute top-3 left-3 bg-[#1c1c16]/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4e8ce]" />
              Featured Photo
            </div>
          </div>

          {/* Secondary 1 */}
          <div
            className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setActivePhotoIndex(1);
              setIsPhotoModalOpen(true);
            }}
          >
            <img
              src={galleryImages[1]}
              alt="Property detail 2"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Secondary 2 */}
          <div
            className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setActivePhotoIndex(2);
              setIsPhotoModalOpen(true);
            }}
          >
            <img
              src={galleryImages[2]}
              alt="Property detail 3"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Secondary 3 */}
          <div
            className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setActivePhotoIndex(3);
              setIsPhotoModalOpen(true);
            }}
          >
            <img
              src={galleryImages[3]}
              alt="Property detail 4"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Secondary 4 with View All Photos Overlay */}
          <div
            className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setActivePhotoIndex(4);
              setIsPhotoModalOpen(true);
            }}
          >
            <img
              src={galleryImages[4]}
              alt="Property detail 5"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex(0);
                setIsPhotoModalOpen(true);
              }}
              className="absolute bottom-3 right-3 bg-white/95 text-[#1c1c16] hover:bg-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md backdrop-blur-sm flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-[#4f614d]" />
              View All Photos ({galleryImages.length})
            </button>
          </div>
        </div>

        {/* Mobile view all photos trigger */}
        <div className="md:hidden p-3 bg-white flex justify-end">
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4f614d] bg-sage-light px-3.5 py-2 rounded-xl"
          >
            <Camera className="w-3.5 h-3.5" />
            View All Photos ({galleryImages.length})
          </button>
        </div>
      </section>

    {isPhotoModalOpen && <PhotoLightbox galleryImages={galleryImages} activePhotoIndex={activePhotoIndex} setActivePhotoIndex={setActivePhotoIndex} onClose={() => setIsPhotoModalOpen(false)} />}
    </>
  );
};

export default PropertyGallery;
