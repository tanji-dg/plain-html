import { deepEqual, throws, equal } from "assert";
import faker from "faker";
import { parseDate, getDenominator, DAYS, MINUTES, HOURS } from "./domain";

describe("domain", () => {
  describe("parseDate", () => {
    context("valid data in api data", () => {
      it("has a lastMufDate equal to a Date representation of the lastMfu", () => {
        deepEqual(parseDate({ lastMfu: "1989-05-09" }), new Date("1989-05-09"));
      });
    });

    context("invalid date in api data", () => {
      it("throws an error that indicates the date is invalid", () => {
        throws(() => parseDate({ lastMfu: "oops" }), /invalid date/);
      });
    });
  });

  describe("getDenominator", () => {
    context(DAYS, () => {
      it("returns 1000 * 60 * 60 * 24", () => {
        const actual = getDenominator(DAYS);
        equal(actual, 1000 * 60 * 60 * 24);
      });
    });

    context(MINUTES, () => {
      it("returns 1000 * 60", () => {
        const actual = getDenominator(MINUTES);
        equal(actual, 1000 * 60);
      });
    });

    context(HOURS, () => {
      it("returns 1000 * 60 * 60", () => {
        const actual = getDenominator(HOURS);
        equal(actual, 1000 * 60 * 60);
      });
    });

    context("unknown unit", () => {
      it("throws an error", () => {
        throws(() => getDenominator(faker.commerce.color()), /unknown unit/);
      });
    });
  });
});
