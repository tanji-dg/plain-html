import React from "react";
import { counter } from "./Counter.css";

export default ({ lastMfu }) => {
  const days = Math.round(
    (new Date() - new Date(lastMfu)) / (1000 * 60 * 60 * 24)
  );

  return <span className={counter}>{days} days since the last MFU</span>;
};
