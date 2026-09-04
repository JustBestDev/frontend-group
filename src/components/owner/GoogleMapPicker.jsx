import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

let mapsPromise;
const loadGoogleMaps = (key) => {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (!mapsPromise) mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Unable to load Google Maps"));
    document.head.appendChild(script);
  });
  return mapsPromise;
};

const componentValue = (components, type) => components.find((item) => item.types.includes(type))?.long_name || "";

const GoogleMapPicker = ({ onPick }) => {
  const mapElement = useRef(null);
  const searchElement = useRef(null);
  const [mapError, setMapError] = useState("");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log('apiKey', apiKey)

  useEffect(() => {
    if (!apiKey) return;
    let active = true;
    loadGoogleMaps(apiKey).then((google) => {
      if (!active) return;
      const center = { lat: 13.7563, lng: 100.5018 };
      const map = new google.maps.Map(mapElement.current, { center, zoom: 12, mapTypeControl: false, streetViewControl: false });
      const marker = new google.maps.Marker({ map, position: center });
      const geocoder = new google.maps.Geocoder();
      const applyPlace = (result, location) => {
        marker.setPosition(location); map.panTo(location);
        const parts = result.address_components || [];
        onPick({
          province: componentValue(parts, "administrative_area_level_1"),
          district: componentValue(parts, "administrative_area_level_2") || componentValue(parts, "locality"),
          subDistrict: componentValue(parts, "sublocality_level_1"),
          postcode: componentValue(parts, "postal_code"),
          road: componentValue(parts, "route"),
          building: componentValue(parts, "premise"),
          latitude: location.lat(), longitude: location.lng(),
        });
      };
      map.addListener("click", ({ latLng }) => geocoder.geocode({ location: latLng }, (results, status) => status === "OK" && results[0] && applyPlace(results[0], latLng)));
      const autocomplete = new google.maps.places.Autocomplete(searchElement.current, { fields: ["address_components", "geometry"] });
      autocomplete.addListener("place_changed", () => { const place = autocomplete.getPlace(); if (place.geometry?.location) applyPlace(place, place.geometry.location); });
    }).catch((error) => active && setMapError(error.message));
    return () => { active = false; };
  }, [apiKey, onPick]);

  if (!apiKey) return <div className="grid min-h-72 place-content-center justify-items-center rounded-2xl border border-dashed border-sage bg-sage-light/30 p-8 text-center text-muted-copy"><MapPin className="mb-3 text-sage-dark" /><strong className="text-ink">Google Maps key required</strong><p className="mt-1 max-w-sm text-sm">Add VITE_GOOGLE_MAPS_API_KEY to your .env file. You can still enter the address manually.</p></div>;
  return <div><input ref={searchElement} className="mb-3 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage-dark" placeholder="Search a place on Google Maps" /><div ref={mapElement} className="h-80 overflow-hidden rounded-2xl border border-line" />{mapError && <p className="mt-2 text-sm text-danger" role="alert">{mapError}</p>}</div>;
};
export default GoogleMapPicker;
