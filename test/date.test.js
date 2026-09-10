import assert from "node:assert/strict";
import test from "node:test";

import { isTodayOrLater, toLocalDateInputValue } from "../src/utils/date.js";

const today = toLocalDateInputValue();
const relativeDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateInputValue(date);
};

test("rejects an available date before today", () => {
  assert.equal(isTodayOrLater(relativeDate(-1), today), false);
});

test("accepts today as an available date", () => {
  assert.equal(isTodayOrLater(today, today), true);
});

test("accepts a future available date", () => {
  assert.equal(isTodayOrLater(relativeDate(1), today), true);
});

test("accepts an empty available date", () => {
  assert.equal(isTodayOrLater("", today), true);
});
