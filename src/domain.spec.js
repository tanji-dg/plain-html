import { deepEqual, throws, equal } from "assert";
import faker from "faker";
import moment from "moment";
import {
  parseDate,
  getDenominator,
  DAYS,
  MINUTES,
  HOURS,
  getTimeForUnit
} from "./domain";

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

  describe("getTimeForUnit()", () => {
    context("inputs are valid", () => {
      context(`unit is ${MINUTES}`, () => {
        [1, 2, 3, 4, 5].forEach(delta => {
          it(`returns the difference in minutes (${delta})`, () => {
            const currentDate = faker.date.future();
            const lastMfuDate = moment(currentDate).subtract(delta, "minutes");
            const actual = getTimeForUnit(currentDate, lastMfuDate, MINUTES);
            equal(actual, delta);
          });
        });
      });

      context(`unit is ${DAYS}`, () => {
        [1, 2, 3, 4, 5].forEach(delta => {
          it(`returns the difference in days (${delta})`, () => {
            const currentDate = faker.date.future();
            const lastMfuDate = moment(currentDate).subtract(delta, "day");
            const actual = getTimeForUnit(currentDate, lastMfuDate, DAYS);
            equal(actual, delta);
          });
        });
      });

      context(`unit is ${HOURS}`, () => {
        [1, 2, 3, 4, 5].forEach(delta => {
          it(`returns the difference in days (${delta})`, () => {
            const currentDate = faker.date.future();
            const lastMfuDate = moment(currentDate).subtract(delta, "hours");
            const actual = getTimeForUnit(currentDate, lastMfuDate, HOURS);
            equal(actual, delta);
          });
        });
      });
    });

    context("lastMfuDate is after current date", () => {
      it("should throw an error", () => {
        const currentDate = faker.date.past();
        const lastMfuDate = faker.date.future();
        throws(
          () => getTimeForUnit(currentDate, lastMfuDate, HOURS),
          /Cannot predict future MFUs/
        );
      });
    });

    context("invalid unit given", () => {
      it("should throw an error", () => {
        throws(
          () =>
            getTimeForUnit(
              faker.date.future(),
              faker.date.past(),
              "INVALID_UNIT"
            ),
          /unknown unit/
        );
      });
    });

    context("lastMfuDate is after the current date", () => {
      it("throws an error", () => {
        throws(
          () => getTimeForUnit(faker.date.past(), faker.date.future(), DAYS),
          /Cannot predict future MFUs/
        );
      });
    });
  });
});
