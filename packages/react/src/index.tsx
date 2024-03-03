import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SubstrateProvider } from "./substrate/SubstrateContext";
import { CHAIN_PROVIDERS } from "./substrate/chains";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <SubstrateProvider providerUrl={CHAIN_PROVIDERS["polkadot"]} appName="test">
      <App />
    </SubstrateProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
