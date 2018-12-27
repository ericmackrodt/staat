import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "./state";
import Calculator from "./calculator";
import Welcome from "./welcome-component";

ReactDOM.render(
  <Provider>
    <Welcome />
    <Calculator />
  </Provider>,
  document.getElementById("entry")
);
