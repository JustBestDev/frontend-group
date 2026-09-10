import { useEffect, useState } from "react";

export default function useImagePreviews(files) {
  const [snapshot, setSnapshot] = useState({ files: null, previews: [] });
  useEffect(() => {
    const previews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    // Object URLs belong to this committed file selection and must be released together.
    // oxlint-disable-next-line react/set-state-in-effect
    setSnapshot({ files, previews });
    return () => previews.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [files]);
  return snapshot.files === files ? snapshot.previews : [];
}
