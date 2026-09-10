import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createPropertyAddressApi, getOwnerPropertyApi, updatePropertyAddressApi, updatePropertyApi } from "../services/ownerApi.js";
import { hasValidQuietHours, parseQuietHours, toHouseRulesPayload } from "../utils/propertyOptions.js";

const propertyFields = [
  "title",
  "description",
  "propertyType",
  "rentType",
  "monthlyRent",
  "deposit",
  "availableDate",
  "totalBedrooms",
];

const addressFields = [
  "province",
  "district",
  "subDistrict",
  "postcode",
  "road",
  "building",
];



export default function useOwnerPropertyEditor(propertyId) {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;

    getOwnerPropertyApi(propertyId)
      .then(({ data }) => {
        if (!active) return;

        setProperty(data);
        setForm({
          ...data,
          monthlyRent: Number(data.monthlyRent),
          deposit: data.deposit == null ? "" : Number(data.deposit),
          availableDate: data.availableDate
            ? data.availableDate.slice(0, 10)
            : "",
          amenityIds: (data.amenities || []).map(({ id }) => id),
          houseRules: (data.houseRules || []).map(({ id, code, value }) => ({
            houseRuleId: id,
            code,
            ...(code === "QUIET_HOURS" ? parseQuietHours(value) : {}),
          })),
          ...Object.fromEntries(
            addressFields.map((field) => [
              field,
              data.address?.[field] || "",
            ]),
          ),
        });
      })
      .catch((requestError) => {
        if (!active) return;

        setError(
          requestError.response?.data?.message || "Unable to load property",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [propertyId]);

  const change = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!hasValidQuietHours(form.houseRules || [])) {
        setError("Quiet hours must use the format 22:00-07:00");
        return;
      }

      const details = Object.fromEntries(
        propertyFields.map((field) => [field, form[field]]),
      );

      details.monthlyRent = Number(details.monthlyRent);
      details.deposit = details.deposit === "" ? null : Number(details.deposit);
      details.totalBedrooms =
        details.totalBedrooms === "" || details.totalBedrooms == null
          ? null
          : Number(details.totalBedrooms);
      details.availableDate = details.availableDate || null;
      details.amenityIds = form.amenityIds || [];
      details.houseRules = toHouseRulesPayload(form.houseRules || []);

      const address = Object.fromEntries(
        addressFields.map((field) => [field, form[field] || null]),
      );
      address.province = form.province;

      const { data: updatedProperty } = await updatePropertyApi(
        propertyId,
        details,
      );

      let addressResponse;
      if (property.address) {
        addressResponse = await updatePropertyAddressApi(propertyId, address);
      } else {
        addressResponse = await createPropertyAddressApi(propertyId, address);
      }

      setProperty({ ...updatedProperty, address: addressResponse.data });
      navigate(`/owner/properties/${propertyId}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save property",
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    addressFields,
    property,
    form,
    setForm,
    loading,
    saving,
    error,
    change,
    save,
  };
}
