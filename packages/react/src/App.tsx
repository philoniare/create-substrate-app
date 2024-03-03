import React from "react";
import { useWallet } from "./substrate/SubstrateContext";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const { connectWallet, account, isConnected, balance } = useWallet();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={connectWallet}>Connect Wallet</button>
        {isConnected && (
          <div style={{ textAlign: "left" }}>
            <div>Address: {account?.address}</div>
            <div>Balance: {balance}</div>
          </div>
        )}
        <a
          className="App-link"
          href="https://polkadot.js.org/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Polkadot.js
        </a>
      </header>
    </div>
  );
}

export default App;
