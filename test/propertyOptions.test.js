import assert from "node:assert/strict";
import test from "node:test";

import {
  formatQuietHours,
  hasValidQuietHours,
  parseQuietHours,
  toHouseRulesPayload,
} from "../src/utils/propertyOptions.js";

test("builds house-rule payloads and validates quiet hours", () => {
  const selected = [
    { houseRuleId: 1, code: "NO_SMOKING" },
    {
      houseRuleId: 2,
      code: "QUIET_HOURS",
      startTime: "22:00",
      endTime: "07:00",
    },
  ];

  assert.deepEqual(toHouseRulesPayload(selected), [
    { houseRuleId: 1 },
    { houseRuleId: 2, value: "22:00-07:00" },
  ]);
  assert.equal(hasValidQuietHours(selected), true);
  assert.equal(
    hasValidQuietHours([
      { houseRuleId: 2, code: "QUIET_HOURS", startTime: "22:00", endTime: "" },
    ]),
    false,
  );
});

test("parses and formats overnight quiet hours", () => {
  assert.deepEqual(parseQuietHours("22:00-07:00"), {
    startTime: "22:00",
    endTime: "07:00",
  });
  assert.deepEqual(parseQuietHours("invalid"), { startTime: "", endTime: "" });
  assert.equal(formatQuietHours("22:00", "07:00"), "22:00-07:00");
  assert.equal(formatQuietHours("22:00", ""), "");
});
