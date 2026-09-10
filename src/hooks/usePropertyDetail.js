import { useCallback, useEffect, useState } from "react";
import api from "../services/api.js";

export default function usePropertyDetail(propertyId) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRoomId, setSelectedRoomId] = useState("");
  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/properties/${propertyId}`);
      const propertyData =
        response.data.data?.property ||
        response.data.data ||
        response.data.property;

      setProperty(propertyData || null);

      if (propertyData?.rooms?.length) {
        const firstAvailable =
          propertyData.rooms.find(
            (r) =>
              (r.status || r.roomStatus || "").toUpperCase() === "AVAILABLE",
          ) || propertyData.rooms[0];
        setSelectedRoomId(String(firstAvailable.id || firstAvailable.roomId));
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to retrieve property details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    fetchProperty,
    selectedRoomId,
    setSelectedRoomId,
  };
}
