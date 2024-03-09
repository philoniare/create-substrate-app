import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SubstrateProvider } from "./substrate/SubstrateContext";

const APP_NAME = process.env.REACT_APP_NAME || "my-app";
const CHAIN = process.env.REACT_APP_CHAIN || "default";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <SubstrateProvider chain={CHAIN} appName={APP_NAME}>
      <App />
    </SubstrateProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
