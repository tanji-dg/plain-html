import { combineReducers } from "redux";
import { SET_LAST_MFU, SET_UNIT, SET_CURRENT_DATE } from "./actions";
import { DAYS } from "./domain";

const lastMfu = (state = null, action) => {
  if (action.type === SET_LAST_MFU) {
    return action.payload;
  }

  return state;
};

const selectedUnit = (state = DAYS, action) => {
  if (action.type === SET_UNIT) {
    return action.payload;
  }
  return state;
};

const currentDate = (state = new Date(), action) => {
  if (action.type === SET_CURRENT_DATE) {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  lastMfu,
  selectedUnit,
  currentDate
});
