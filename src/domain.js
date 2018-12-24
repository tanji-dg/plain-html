export const DAYS = "DAYS";
export const HOURS = "HOURS";
export const MINUTES = "MINUTES";

export const parseDate = apiData => {
  const parsed = new Date(apiData.lastMfu);
  if (isNaN(parsed)) {
    throw new Error("invalid date");
  }
  return parsed;
};

export const getDenominator = unit => {
  switch (unit) {
    case DAYS:
      return 1000 * 60 * 60 * 24;
    case HOURS:
      return 1000 * 60 * 60;
    case MINUTES:
      return 1000 * 60;
    default:
      throw new Error("unknown unit");
  }
};

export const getTimeForUnit = (currentDate, lastMfuDate, unit) => {
  const delta =
    Math.floor(((currentDate - lastMfuDate) / getDenominator(unit)) * 10) / 10;

  if (delta < 0) {
    throw new Error("Cannot predict future MFUs!");
  }

  return delta;
};
