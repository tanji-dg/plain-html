import React from "react";
import Counter from "./Counter.js";
import styles from "./Display.css";
import UnitSelector from "./UnitSelector.js";

export default () => (
  <div className={styles.display}>
    <Counter />
    <p>
      <UnitSelector /> since last MFU.
    </p>
  </div>
);
