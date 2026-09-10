import {
  Building2,
  Map,
  MapPin,
  TrainFront,
} from "lucide-react";

const LocationSearchMenu = ({
  isOpen,
  onTransitClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="location-search-menu">
      <button
        type="button"
        className="location-search-option"
        onClick={onTransitClick}
      >
        <TrainFront size={23} />

        <div>
          <strong>Search by BTS/MRT</strong>
          <span>Choose one or more train stations</span>
        </div>
      </button>

      <button
        type="button"
        className="location-search-option"
      >
        <Map size={23} />

        <div>
          <strong>Search by District</strong>
          <span>Search by district in Bangkok</span>
        </div>
      </button>

      <button
        type="button"
        className="location-search-option"
      >
        <MapPin size={23} />

        <div>
          <strong>Search by Area</strong>
          <span>Search by neighbourhood or area</span>
        </div>
      </button>

      <button
        type="button"
        className="location-search-option"
      >
        <Building2 size={23} />

        <div>
          <strong>Search by Property</strong>
          <span>Search by property or building name</span>
        </div>
      </button>
    </div>
  );
};

export default LocationSearchMenu;