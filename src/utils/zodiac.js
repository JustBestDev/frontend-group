const ZODIAC_BY_MONTH = [
  [20, "CAPRICORN", "AQUARIUS"],
  [19, "AQUARIUS", "PISCES"],
  [21, "PISCES", "ARIES"],
  [20, "ARIES", "TAURUS"],
  [21, "TAURUS", "GEMINI"],
  [21, "GEMINI", "CANCER"],
  [23, "CANCER", "LEO"],
  [23, "LEO", "VIRGO"],
  [23, "VIRGO", "LIBRA"],
  [23, "LIBRA", "SCORPIO"],
  [22, "SCORPIO", "SAGITTARIUS"],
  [22, "SAGITTARIUS", "CAPRICORN"],
];

const ZODIAC_SYMBOLS = {
  ARIES: "♈",
  TAURUS: "♉",
  GEMINI: "♊",
  CANCER: "♋",
  LEO: "♌",
  VIRGO: "♍",
  LIBRA: "♎",
  SCORPIO: "♏",
  SAGITTARIUS: "♐",
  CAPRICORN: "♑",
  AQUARIUS: "♒",
  PISCES: "♓",
};

export function getZodiacFromBirthdate(birthdate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthdate || "");
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const [cutoff, before, after] = ZODIAC_BY_MONTH[month - 1];
  const code = day < cutoff ? before : after;

  return {
    code,
    name: code.charAt(0) + code.slice(1).toLowerCase(),
    symbol: ZODIAC_SYMBOLS[code],
  };
}
