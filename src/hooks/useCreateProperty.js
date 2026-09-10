import { useCallback, useState } from "react";
import useImagePreviews from "./useImagePreviews.js";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createPropertyAddressApi, createPropertyApi, uploadPropertyImagesApi } from "../services/ownerApi.js";
import { toLocalDateInputValue } from "../utils/date.js";
import { hasValidQuietHours, toHouseRulesPayload } from "../utils/propertyOptions.js";

export default function useCreateProperty() {
  const today = toLocalDateInputValue();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [images, setImages] = useState([]);
  const [pageError, setPageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addressCreated, setAddressCreated] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [amenityIds, setAmenityIds] = useState([]);
  const [houseRules, setHouseRules] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      propertyType: "CONDO",
      rentType: "WHOLE_UNIT",
    },
  });
  const previews = useImagePreviews(images);
  const applyMapAddress = useCallback(
    (address) =>
      Object.entries(address).forEach(([key, value]) =>
        setValue(key, value, { shouldValidate: true }),
      ),
    [setValue],
  );

  const addImages = (files) => {
    const selected = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (images.length + selected.length > 5)
      return setPageError("A property can have no more than 5 images");
    const next = [...images, ...selected];
    const oversized = next.find((file) => file.size > 5 * 1024 * 1024);
    if (oversized) return setPageError(`${oversized.name} exceeds 5 MB`);
    setPageError("");
    setImages(next);
  };

  const nextStep = async () => {
    const groups =
      step === 1
        ? [
            "title",
            "description",
            "propertyType",
            "rentType",
            "monthlyRent",
            "availableDate",
            "totalBedrooms",
          ]
        : ["province"];
    if (step < 3 && !(await trigger(groups))) return;
    if (step === 1 && !hasValidQuietHours(houseRules)) {
      return setPageError("Quiet hours must use the format 22:00-07:00");
    }
    if (step === 3 && images.length === 0)
      return setPageError("Add at least one property image");
    setPageError("");
    setStep((current) => Math.min(3, current + 1));
  };

  const onSubmit = async (data) => {

    setSubmitting(true);
    setPageError("");
    try {
      let id = propertyId;
      if (!id) {
        const response = await createPropertyApi({
          title: data.title,
          description: data.description,
          propertyType: data.propertyType,
          rentType: data.rentType,
          monthlyRent: Number(data.monthlyRent),
          deposit: data.deposit ? Number(data.deposit) : null,
          availableDate: data.availableDate || null,
          totalBedrooms: data.totalBedrooms ? Number(data.totalBedrooms) : null,
          amenityIds,
          houseRules: toHouseRulesPayload(houseRules),
        });
        id = response.data.id;
        setPropertyId(id);
      }
      if (!addressCreated) {
        await createPropertyAddressApi(id, {
          province: data.province,
          district: data.district || null,
          subDistrict: data.subDistrict || null,
          postcode: data.postcode || null,
          road: data.road || null,
          building: data.building || null,
          latitude:
            data.latitude === "" || data.latitude == null
              ? null
              : Number(data.latitude),
          longitude:
            data.longitude === "" || data.longitude == null
              ? null
              : Number(data.longitude),
        });
        setAddressCreated(true);
      }
      if (!imagesUploaded) {
        await uploadPropertyImagesApi(id, images);
        setImagesUploaded(true);
      }
      navigate("/owner/properties");
    } catch (error) {
      setPageError(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    amenityIds,
    setAmenityIds,
    houseRules,
    setHouseRules,
    today,
    step,
    setStep,
    images,
    setImages,
    pageError,
    submitting,
    register,
    handleSubmit,
    errors,
    previews,
    applyMapAddress,
    addImages,
    nextStep,
    onSubmit,
  };
}
