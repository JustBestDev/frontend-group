import { MapPin, Search } from "lucide-react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

const DEFAULT_CENTER = [100.5018, 13.7563];
const TOMTOM_SEARCH_URL = "https://api.tomtom.com/search/2";

const toFormAddress = (address, latitude, longitude) => ({
  province: address.countrySubdivision || "",
  district:
    address.countrySecondarySubdivision || address.municipality || "",
  subDistrict: address.municipalitySubdivision || "",
  postcode: address.postalCode || "",
  road: address.streetName || "",
  building: address.streetNumber || "",
  latitude,
  longitude,
});

const GoogleMapPicker = ({ onPick }) => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const requestControllerRef = useRef(null);
  const onPickRef = useRef(onPick);

  const [query, setQuery] = useState("");
  const [mapError, setMapError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    if (!apiKey || !mapElement.current) return undefined;

    const map = new maplibregl.Map({
      container: mapElement.current,
      style: {
        version: 8,
        sources: {
          tomtom: {
            type: "raster",
            tiles: [
              `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${apiKey}&language=th-TH`,
            ],
            tileSize: 256,
            attribution: "© TomTom",
          },
        },
        layers: [{ id: "tomtom", type: "raster", source: "tomtom" }],
      },
      center: DEFAULT_CENTER,
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const marker = new maplibregl.Marker({ color: "#d9534f" })
      .setLngLat(DEFAULT_CENTER)
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    const handleMapClick = async ({ lngLat }) => {
      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;
      setIsSearching(false);

      try {
        setMapError("");
        const params = new URLSearchParams({
          key: apiKey,
          language: "th-TH",
          radius: "100",
        });
        const response = await fetch(
          `${TOMTOM_SEARCH_URL}/reverseGeocode/${lngLat.lat},${lngLat.lng}.json?${params}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("ไม่สามารถค้นหาที่อยู่ได้");

        const data = await response.json();
        const result = data.addresses?.[0];
        if (!result?.address) throw new Error("ไม่พบข้อมูลที่อยู่ของตำแหน่งนี้");

        marker.setLngLat([lngLat.lng, lngLat.lat]);
        map.flyTo({ center: [lngLat.lng, lngLat.lat], zoom: 16 });
        onPickRef.current(
          toFormAddress(result.address, lngLat.lat, lngLat.lng),
        );
      } catch (error) {
        if (error.name !== "AbortError") setMapError(error.message);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      requestControllerRef.current?.abort();
      map.off("click", handleMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [apiKey]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const keyword = query.trim();
    if (!keyword || !apiKey) return;

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setIsSearching(true);
    setMapError("");

    try {
      const params = new URLSearchParams({
        key: apiKey,
        language: "th-TH",
        countrySet: "TH",
        limit: "1",
      });
      const response = await fetch(
        `${TOMTOM_SEARCH_URL}/search/${encodeURIComponent(keyword)}.json?${params}`,
        { signal: controller.signal },
      );

      if (!response.ok) throw new Error("ไม่สามารถค้นหาสถานที่ได้");

      const data = await response.json();
      const result = data.results?.[0];
      if (!result?.position || !result.address) {
        throw new Error("ไม่พบสถานที่ที่ค้นหา");
      }

      const { lat, lon } = result.position;
      markerRef.current?.setLngLat([lon, lat]);
      mapRef.current?.flyTo({ center: [lon, lat], zoom: 16 });
      onPickRef.current(toFormAddress(result.address, lat, lon));
    } catch (error) {
      if (error.name !== "AbortError") setMapError(error.message);
    } finally {
      if (requestControllerRef.current === controller) setIsSearching(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="grid min-h-72 place-content-center justify-items-center rounded-2xl border border-dashed border-sage bg-sage-light/30 p-8 text-center text-muted-copy">
        <MapPin className="mb-3 text-sage-dark" />
        <strong className="text-ink">TomTom API key required</strong>
        <p className="mt-1 max-w-sm text-sm">
          Add VITE_TOMTOM_API_KEY to your frontend .env file.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch(event);
          }}
          className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage-dark"
          placeholder="ค้นหาสถานที่หรือที่อยู่ในประเทศไทย"
          aria-label="ค้นหาสถานที่"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-sage-dark px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search size={18} />
          <span className="hidden sm:inline">
            {isSearching ? "กำลังค้นหา..." : "ค้นหา"}
          </span>
        </button>
      </div>

      <div
        ref={mapElement}
        className="h-80 overflow-hidden rounded-2xl border border-line"
      />

      <p className="mt-2 text-xs text-muted-copy">
        ค้นหาสถานที่หรือคลิกบนแผนที่เพื่อปักหมุดและกรอกข้อมูลที่อยู่
      </p>

      {mapError && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {mapError}
        </p>
      )}
    </div>
  );
};

export default GoogleMapPicker;
