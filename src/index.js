import React from "react";
import { render } from "react-dom";
import ApplicationRoot from "./components/ApplicationRoot.js";

render(
  <ApplicationRoot />,
  (() => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    return target;
  })()
);
