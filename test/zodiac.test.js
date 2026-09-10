import test from "node:test";
import assert from "node:assert/strict";
import { getZodiacFromBirthdate } from "../src/utils/zodiac.js";

test("derives zodiac names and symbols at date boundaries", () => {
  assert.deepEqual(getZodiacFromBirthdate("1990-03-20"), {
    code: "PISCES",
    name: "Pisces",
    symbol: "♓",
  });
  assert.deepEqual(getZodiacFromBirthdate("1990-03-21"), {
    code: "ARIES",
    name: "Aries",
    symbol: "♈",
  });
  assert.equal(getZodiacFromBirthdate("1990-12-22").code, "CAPRICORN");
});

test("returns null for empty or invalid birthdates", () => {
  assert.equal(getZodiacFromBirthdate(""), null);
  assert.equal(getZodiacFromBirthdate("not-a-date"), null);
  assert.equal(getZodiacFromBirthdate("1990-02-30"), null);
});
