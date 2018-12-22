import React from "react";
import { Provider } from "react-redux";

import Display from "./Display.js";
import store from "../store.js";
import styles from "./ApplicationRoot.css";

export default () => (
  <div className={styles.applicationRoot}>
    <Provider store={store}>
      <Display />
    </Provider>
  </div>
);
