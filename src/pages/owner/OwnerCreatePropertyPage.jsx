import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import GoogleMapPicker from "../../components/owner/GoogleMapPicker.jsx";
import {
  createPropertyAddressApi,
  createPropertyApi,
  createPropertyRoomApi,
  uploadPropertyImagesApi,
} from "../../services/ownerApi.js";

const steps = ["Property details", "Address", "Photos", "Rooms & review"];
const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10";
const fieldClass = "grid gap-1.5 text-sm font-semibold text-ink";

const OwnerCreatePropertyPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [images, setImages] = useState([]);
  const [pageError, setPageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addressCreated, setAddressCreated] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [createdRoomCount, setCreatedRoomCount] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      propertyType: "CONDO",
      rentType: "WHOLE_UNIT",
      rooms: [{ roomName: "", description: "", monthlyRent: "", capacity: 1 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "rooms" });
  const previews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images],
  );
  useEffect(
    () => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)),
    [previews],
  );
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
        ? ["title", "description", "propertyType", "rentType", "monthlyRent"]
        : ["province"];
    if (step < 3 && !(await trigger(groups))) return;
    if (step === 3 && images.length === 0)
      return setPageError("Add at least one property image");
    setPageError("");
    setStep((current) => Math.min(4, current + 1));
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
      const validRooms = data.rooms.filter((room) => room.roomName);
      for (
        let index = createdRoomCount;
        index < validRooms.length;
        index += 1
      ) {
        const room = validRooms[index];
        await createPropertyRoomApi(id, {
          ...room,
          monthlyRent: Number(room.monthlyRent),
          capacity: Number(room.capacity),
        });
        setCreatedRoomCount(index + 1);
      }
      navigate("/owner/properties");
    } catch (error) {
      setPageError(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl pb-10">
      <Link
        to="/owner/properties"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
      >
        <ArrowLeft size={16} />
        My Properties
      </Link>
      <h1 className="font-serif text-4xl text-ink md:text-5xl">
        Create a new property
      </h1>
      <p className="mt-2 text-muted-copy">
        Add the details tenants need to discover your property.
      </p>
      <ol className="my-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {steps.map((label, index) => {
          const number = index + 1;
          return (
            <li
              key={label}
              className={`flex items-center gap-3 border-b-2 pb-3 ${number <= step ? "border-sage-dark text-ink" : "border-line text-muted-copy"}`}
            >
              <span
                className={`grid size-9 place-items-center rounded-full ${number < step ? "bg-sage-dark text-white" : number === step ? "bg-forest text-white" : "bg-[#eeece4]"}`}
              >
                {number < step ? <Check size={18} /> : number}
              </span>
              <strong className="text-sm">{label}</strong>
            </li>
          );
        })}
      </ol>
      {pageError && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-danger" role="alert">
          {pageError}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm md:p-7">
            {step === 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                <label className={fieldClass}>
                  Title
                  <input
                    className={inputClass}
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <small className="text-danger">
                      {errors.title.message}
                    </small>
                  )}
                </label>
                <label className={fieldClass}>
                  Property type
                  <select className={inputClass} {...register("propertyType")}>
                    <option value="HOUSE">House</option>
                    <option value="CONDO">Condominium</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="DORMITORY">Dormitory</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label className={`${fieldClass} md:col-span-2`}>
                  Rent type
                  <select className={inputClass} {...register("rentType")}>
                    <option value="WHOLE_UNIT">Whole unit</option>
                    <option value="INDIVIDUAL_ROOM">Individual rooms</option>
                  </select>
                </label>
                <label className={`${fieldClass} md:col-span-2`}>
                  Description
                  <textarea
                    rows="4"
                    className={inputClass}
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                </label>
                <label className={fieldClass}>
                  Monthly rent
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    {...register("monthlyRent", { required: true, min: 0 })}
                  />
                </label>
                <label className={fieldClass}>
                  Deposit
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    {...register("deposit")}
                  />
                </label>
                <label className={fieldClass}>
                  Available date
                  <input
                    type="date"
                    className={inputClass}
                    {...register("availableDate")}
                  />
                </label>
                <label className={fieldClass}>
                  Total bedrooms
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    {...register("totalBedrooms")}
                  />
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid content-start gap-4">
                  <label className={fieldClass}>
                    Province
                    <input
                      className={inputClass}
                      {...register("province", {
                        required: "Province is required",
                      })}
                    />
                    {errors.province && (
                      <small className="text-danger">
                        {errors.province.message}
                      </small>
                    )}
                  </label>
                  {[
                    "district",
                    "subDistrict",
                    "postcode",
                    "road",
                    "building",
                  ].map((name) => (
                    <label className={fieldClass} key={name}>
                      {name.replace(/([A-Z])/g, " $1")}
                      <input className={inputClass} {...register(name)} />
                    </label>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <label className={fieldClass}>
                      Latitude
                      <input
                        readOnly
                        className={inputClass}
                        {...register("latitude")}
                      />
                    </label>
                    <label className={fieldClass}>
                      Longitude
                      <input
                        readOnly
                        className={inputClass}
                        {...register("longitude")}
                      />
                    </label>
                  </div>
                </div>
                <GoogleMapPicker onPick={applyMapAddress} />
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-2xl">Add property photos</h2>
                <label className="mt-5 grid cursor-pointer place-content-center justify-items-center rounded-2xl border-2 border-dashed border-sage p-10 text-center">
                  <Upload className="mb-3 text-sage-dark" />
                  <strong>Choose up to 5 photos</strong>
                  <span className="mt-1 text-sm text-muted-copy">
                    JPEG, PNG, WebP or GIF · maximum 5 MB each
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => addImages(event.target.files)}
                  />
                </label>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {previews.map(({ file, url }, index) => (
                    <div
                      className="relative overflow-hidden rounded-xl"
                      key={`${file.name}-${file.lastModified}`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-forest px-2 py-1 text-xs text-white">
                          Cover photo
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() =>
                          setImages((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="font-serif text-2xl">Rooms & review</h2>
                <div className="mt-5 grid gap-4">
                  {fields.map((field, index) => (
                    <fieldset
                      className="grid gap-3 rounded-xl border border-line p-4 md:grid-cols-4"
                      key={field.id}
                    >
                      <label className={fieldClass}>
                        Room name
                        <input
                          className={inputClass}
                          {...register(`rooms.${index}.roomName`)}
                        />
                      </label>
                      <label className={fieldClass}>
                        Monthly rent
                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          {...register(`rooms.${index}.monthlyRent`)}
                        />
                      </label>
                      <label className={fieldClass}>
                        Capacity
                        <input
                          type="number"
                          min="1"
                          className={inputClass}
                          {...register(`rooms.${index}.capacity`)}
                        />
                      </label>
                      <label className={fieldClass}>
                        Description
                        <input
                          className={inputClass}
                          {...register(`rooms.${index}.description`)}
                        />
                      </label>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="text-left text-sm font-bold text-danger"
                          onClick={() => remove(index)}
                        >
                          Remove room
                        </button>
                      )}
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-sage p-3 font-bold text-sage-dark"
                    onClick={() =>
                      append({
                        roomName: "",
                        description: "",
                        monthlyRent: "",
                        capacity: 1,
                      })
                    }
                  >
                    <Plus size={17} />
                    Add another room
                  </button>
                </div>
              </div>
            )}
          </div>
          <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-serif text-xl">Listing checklist</h2>
            <div className="mt-5 grid gap-4">
              {steps.map((label, index) => (
                <div className="flex items-center gap-3" key={label}>
                  <span
                    className={`grid size-8 place-items-center rounded-full ${index + 1 <= step ? "bg-sage-light text-sage-dark" : "bg-[#eeece4] text-muted-copy"}`}
                  >
                    {index + 1 < step ? <Check size={16} /> : index + 1}
                  </span>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <div className="flex justify-between text-sm">
                <span>Your progress</span>
                <strong>{step * 25}%</strong>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeece4]">
                <div
                  className="h-full bg-sage-dark"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>
          </aside>
        </div>
        <div className="mt-5 flex justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-sage-dark px-5 py-3 font-bold text-sage-dark"
              onClick={() => setStep((current) => current - 1)}
            >
              <ArrowLeft size={17} />
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 font-bold text-white"
              onClick={nextStep}
            >
              Continue <ArrowRight size={17} />
            </button>
          ) : (
            <button
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 font-bold text-white disabled:opacity-50"
            >
              <ImagePlus size={17} />
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default OwnerCreatePropertyPage;
