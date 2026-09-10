import { Link } from "react-router";
import { Home, ChevronRight, Heart, Share2 } from "lucide-react";

const PropertyActions = ({ property, isSaved, handleToggleSave, handleShare }) => {

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-copy overflow-x-auto">
        <Link
          to="/"
          className="hover:text-[#4f614d] flex items-center gap-1 transition-colors shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#a8b0a7] shrink-0" />
        <Link
          to="/properties"
          className="hover:text-[#4f614d] transition-colors shrink-0"
        >
          All Properties
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#a8b0a7] shrink-0" />
        <span className="text-[#1c1c16] font-medium truncate max-w-50 sm:max-w-[320px]">
          {property.title || property.name || "Property Details"}
        </span>
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleSave}
          className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-semibold ${isSaved
            ? "bg-[#eedcd4] border-[#d8b8a8] text-[#835024]"
            : "bg-white border-[#e1e5dd] text-muted-copy hover:text-[#835024] hover:bg-[#faf7f2]"
            }`}
          title={isSaved ? "Saved" : "Save Property"}
        >
          <Heart
            className={`w-4 h-4 ${isSaved ? "fill-[#835024] text-[#835024]" : ""
              }`}
          />
          <span className="hidden sm:inline">
            {isSaved ? "Saved" : "Save"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="p-2.5 rounded-full bg-white border border-[#e1e5dd] text-muted-copy hover:text-[#4f614d] hover:bg-[#faf7f2] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-semibold"
          title="Share Listing"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PropertyActions;
