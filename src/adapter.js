import Axios from "axios";
import { parseDate } from "./domain.js";

const fetchMfuStatisticOverHttp = () =>
  Axios.get(`/mfu.json?${new Date().toISOString()}`)
    .then(response => response.data)
    .then(parseDate);

const mockFetchMfuStatistic = () =>
  new Promise(resolve => resolve(new Date() - 1000 * 60 * 60 * 24));

const fetchMfuStatistic = (() =>
  process.env.NODE_ENV === "test"
    ? mockFetchMfuStatistic
    : fetchMfuStatisticOverHttp)();

export { fetchMfuStatistic };
