import faker from "faker";
import {
  SET_LAST_MFU,
  setLastMfu,
  SET_CURRENT_DATE,
  setCurrentDate
} from "./actions";
import { equal } from "assert";

describe("actions", () => {
  describe("setLastMfu", () => {
    it(`creates an action with the ${SET_LAST_MFU} type`, () => {
      const actual = setLastMfu(faker.date.past());
      equal(actual.type, SET_LAST_MFU);
    });

    it(`passes the given payload along as the payload property`, () => {
      const mockLastMfuDate = faker.date.past();
      const actual = setLastMfu(mockLastMfuDate);
      equal(actual.payload, mockLastMfuDate);
    });
  });

  describe("setCurrentDate", () => {
    it(`creates an action with the ${SET_CURRENT_DATE} type`, () => {
      const actual = setCurrentDate(faker.date.past());
      equal(actual.type, SET_CURRENT_DATE);
    });

    it(`passes the given payload along as the payload property`, () => {
      const mockLastMfuDate = faker.date.future();
      const actual = setCurrentDate(mockLastMfuDate);
      equal(actual.payload, mockLastMfuDate);
    });
  });

  describe("getLastMfuDate", () => {});
});
