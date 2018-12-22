import { getTimeForUnit } from "./domain";

export const getCounterValue = state => {
  if (state.lastMfu === null) {
    return 0;
  }
  return getTimeForUnit(
    new Date(state.currentDate),
    new Date(state.lastMfu),
    state.selectedUnit
  );
};
