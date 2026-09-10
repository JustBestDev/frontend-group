import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import { filterProperties } from "../utils/propertySearch.js";

export default function usePropertySearch() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("ALL");
  const [rentType, setRentType] = useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");
  const [bedrooms, setBedrooms] = useState("ALL");
  const [province, setProvince] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/properties");

      const propertyData =
        response.data.data?.properties ||
        response.data.data ||
        response.data.properties ||
        [];

      setProperties(Array.isArray(propertyData) ? propertyData : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to retrieve properties",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Synchronize the initial list with the server.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchProperties();
  }, [fetchProperties]);

  const provinces = useMemo(() => {
    return [
      ...new Set(
        properties
          .map((property) => property.address?.province)
          .filter(Boolean),
      ),
    ].sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return filterProperties(properties, { search, propertyType, rentType, priceRange, bedrooms, province });
  }, [
    properties,
    search,
    propertyType,
    rentType,
    priceRange,
    bedrooms,
    province,
  ]);

  const clearFilters = () => {
    setSearch("");
    setPropertyType("ALL");
    setRentType("ALL");
    setPriceRange("ALL");
    setBedrooms("ALL");
    setProvince("ALL");
  };

  return {
    search,
    setSearch,
    propertyType,
    setPropertyType,
    rentType,
    setRentType,
    priceRange,
    setPriceRange,
    bedrooms,
    setBedrooms,
    province,
    setProvince,
    loading,
    error,
    provinces,
    filteredProperties,
    fetchProperties,
    clearFilters,
  };
}
