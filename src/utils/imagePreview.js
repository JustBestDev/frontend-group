export const imagePreviewReducer = (index, action) => {
  if (action.type === "open") return action.index;
  if (action.type === "close") return null;
  if (index == null || action.total < 2) return index;
  if (action.type === "next") return (index + 1) % action.total;
  if (action.type === "previous") return (index - 1 + action.total) % action.total;
  return index;
};

export const imagePreviewActionForKey = (key) => {
  if (key === "Escape") return { type: "close" };
  if (key === "ArrowRight") return { type: "next" };
  if (key === "ArrowLeft") return { type: "previous" };
  return null;
};
