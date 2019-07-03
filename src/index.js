import React from "react";
import { render } from "react-dom";

import Counter from "./Counter.js";
import wall from "./404-mifi_vs_the_wall.jpg";

import styles from "./index.css";

render(
  <div
    className={styles.background}
    style={{ backgroundImage: `url(${wall})` }}
  >
    <Counter lastMfu={new Date(window.lastMfu)} />
  </div>,
  document.getElementById("🍻")
);
