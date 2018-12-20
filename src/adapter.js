import Axios from "axios";
import { parseDate } from "./domain.js";

const createDelay = delayInMilliseconds => x =>
  new Promise(resolve => {
    setTimeout(() => resolve(x), delayInMilliseconds);
  });

export const fetchMfuStatistic = () =>
  Axios.get(`/mfu.json?${new Date().toISOString()}`)
    .then(response => response.data)
    .then(createDelay(700))
    .then(parseDate);
