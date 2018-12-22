import { getLastMfu } from "./service";

export const SET_LAST_MFU = "SET_LAST_MFU";
export const SET_UNIT = "SET_UNIT";
export const SET_CURRENT_DATE = "SET_CURRENT_DATE";

export const setLastMfu = payload => ({
  type: SET_LAST_MFU,
  payload
});

export const setUnit = payload => ({
  type: SET_UNIT,
  payload
});

export const setCurrentDate = (payload = new Date()) => ({
  type: SET_CURRENT_DATE,
  payload
});

export const getLastMfuDate = () => dispatch =>
  getLastMfu()
    .then(setLastMfu)
    .then(dispatch);
