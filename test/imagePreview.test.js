import assert from "node:assert/strict";
import test from "node:test";

import {
  imagePreviewActionForKey,
  imagePreviewReducer,
} from "../src/utils/imagePreview.js";

test("opens and closes the property image preview", () => {
  const openIndex = imagePreviewReducer(null, { type: "open", index: 2 });

  assert.equal(openIndex, 2);
  assert.equal(imagePreviewReducer(openIndex, { type: "close" }), null);
  assert.deepEqual(imagePreviewActionForKey("Escape"), { type: "close" });
});

test("moves through every property image and wraps at each end", () => {
  assert.equal(imagePreviewReducer(0, { type: "next", total: 3 }), 1);
  assert.equal(imagePreviewReducer(2, { type: "next", total: 3 }), 0);
  assert.equal(imagePreviewReducer(0, { type: "previous", total: 3 }), 2);
  assert.deepEqual(imagePreviewActionForKey("ArrowRight"), { type: "next" });
  assert.deepEqual(imagePreviewActionForKey("ArrowLeft"), {
    type: "previous",
  });
});
