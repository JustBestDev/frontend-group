import { useMemo } from "react";
import useImagePreviews from "./useImagePreviews.js";

export default function useImagePreview(file) {
  const files = useMemo(() => file ? [file] : [], [file]);
  return useImagePreviews(files)[0]?.url || "";
}
