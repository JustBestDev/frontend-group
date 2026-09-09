import {
  Building2,
  Car,
  CigaretteOff,
  CookingPot,
  Dumbbell,
  Moon,
  PanelsTopLeft,
  PartyPopper,
  PawPrint,
  Refrigerator,
  Snowflake,
  Users,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";

export const propertyOptionIcons = {
  WIFI: Wifi,
  AIR_CONDITIONING: Snowflake,
  PARKING: Car,
  WASHING_MACHINE: WashingMachine,
  REFRIGERATOR: Refrigerator,
  ELEVATOR: Building2,
  BALCONY: PanelsTopLeft,
  FITNESS: Dumbbell,
  SWIMMING_POOL: Waves,
  PETS_ALLOWED: PawPrint,
  NO_SMOKING: CigaretteOff,
  GUESTS_ALLOWED: Users,
  NO_PARTIES: PartyPopper,
  COOKING_ALLOWED: CookingPot,
  QUIET_HOURS: Moon,
};

const QUIET_HOURS_PATTERN = /^((?:[01]\d|2[0-3]):[0-5]\d)-((?:[01]\d|2[0-3]):[0-5]\d)$/;

export const parseQuietHours = (value) => {
  const match = QUIET_HOURS_PATTERN.exec(value || "");
  return match
    ? { startTime: match[1], endTime: match[2] }
    : { startTime: "", endTime: "" };
};

export const formatQuietHours = (startTime, endTime) =>
  startTime && endTime ? `${startTime}-${endTime}` : "";

export const hasValidQuietHours = (houseRules) =>
  houseRules.every(
    ({ code, startTime, endTime }) =>
      code !== "QUIET_HOURS" ||
      QUIET_HOURS_PATTERN.test(formatQuietHours(startTime, endTime)),
  );

export const toHouseRulesPayload = (houseRules) =>
  houseRules.map(({ houseRuleId, code, startTime, endTime }) => ({
    houseRuleId,
    ...(code === "QUIET_HOURS"
      ? { value: formatQuietHours(startTime, endTime) }
      : {}),
  }));
