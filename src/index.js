import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { EventProvider } from "./context/EventContext";
import "bootstrap/dist/css/bootstrap.min.css";

const root = document.getElementById("root");

const createRoot = (element) => {
  if (root !== null) {
    return ReactDOM.createRoot(root).render(element);
  }
};

const render = () => {
  const App = require("./App").default;
  createRoot(
    <React.StrictMode>
      {" "}
      <EventProvider>
        <Router>
          <App />
        </Router>
      </EventProvider>
    </React.StrictMode>
  );
};

if (module.hot) {
  module.hot.accept("./App", render);
}

render();
