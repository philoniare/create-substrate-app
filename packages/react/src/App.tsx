import React, { ChangeEvent, useState, useEffect } from "react";
import { useWallet } from "./substrate/SubstrateContext";
import { HexString } from "@polkadot/util/types";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { CHAIN_PROVIDERS } from "./substrate/chains";
import "./App.css";

function App() {
  const {
    connectWallet,
    accounts,
    isConnected,
    fetchBalance,
    transfer,
    chain,
  } = useWallet();
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState("0");
  const [resultHash, setResultHash] = useState<HexString | undefined>(
    undefined,
  );
  const [chosenAccount, setChoseAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [balance, setBalance] = useState("");

  useEffect(async () => {
    const chainBalance = await fetchBalance(chosenAccount);
    setBalance(chainBalance);
  }, [chosenAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chosenAccount) {
      const hash = await transfer(toAddress, amount, chosenAccount);
      setResultHash(hash);
    }
  };

  const handleAccountUpdate = () => {};

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={CHAIN_PROVIDERS[chain].logo}
          className="App-logo"
          alt="logo"
        />
        {!isConnected && (
          <button onClick={connectWallet} className={"submit-btn"}>
            Connect Wallet
          </button>
        )}

        {isConnected && accounts && (
          <div style={{ textAlign: "left" }}>
            <div>
              Account:
              <select id="account">
                {accounts.map((account) => (
                  <option>{account.address}</option>
                ))}
              </select>
            </div>
            <table className={"balance-table"}>
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Address</th>
                  <th className="table-header">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{chosenAccount?.meta?.name}</td>
                  <td>{chosenAccount?.address}</td>
                  <td>{balance}</td>
                </tr>
              </tbody>
            </table>
            <div className="transfer-div">
              <div className="transfer-input">
                <label htmlFor="to">To address:</label>
                <input
                  id="to"
                  type="text"
                  value={toAddress}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setToAddress(e.target.value)
                  }
                />
              </div>
              <div className="transfer-input">
                <label htmlFor="amount">Amount (Units):</label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAmount(e.target.value)
                  }
                />
              </div>
              <div style={{ textAlign: "center" }}>
                {resultHash && <span>Tx Hash: {resultHash}</span>}
                <button className="submit-btn" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
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
