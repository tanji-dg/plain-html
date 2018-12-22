import Axios from "axios";
import { parseDate } from "./domain.js";

export const fetchMfuStatistic = () =>
  Axios.get(`/mfu.json?${new Date().toISOString()}`)
    .then(response => response.data)
    .then(parseDate);
