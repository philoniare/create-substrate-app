import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  web3AccountsSubscribe,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { formatBalance } from "@polkadot/util";
import { HexString } from "@polkadot/util/types";

// Define the shape of the context for Substrate integration
interface SubstrateContextType {
  api: ApiPromise | null;
  connectWallet: () => Promise<void>;
  account: InjectedAccountWithMeta | null;
  isConnected: boolean;
  balance: string;
  transfer: (
    recipientAddress: string,
    amount: string,
  ) => Promise<HexString | undefined>;
}

interface SubstrateProviderProps {
  children: ReactNode;
  providerUrl: string;
  appName: string;
}

// Create a context for Substrate API interaction
export const SubstrateContext = createContext<SubstrateContextType | null>(
  null,
);

const SubstrateProvider: React.FC<SubstrateProviderProps> = ({
  children,
  providerUrl,
  appName,
}) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");

  // Connects to the Polkadot{.js} extension and subscribes to account changes
  const connectWallet = async () => {
    try {
      await web3Enable(appName);
      await web3AccountsSubscribe(
        (injectedAccounts: InjectedAccountWithMeta[]) => {
          if (injectedAccounts.length > 0) {
            setAccount(injectedAccounts[0]);
            setIsConnected(true);
          }
        },
      );
    } catch (error) {
      console.error(
        "Failed to fetch accounts from Polkadot{.js} extension:",
        error,
      );
    }
  };

  const transfer = async (recipientAddress: string, amount: string) => {
    try {
      const amountInSmallestDenom = parseFloat(amount);
      if (api && account) {
        if (!api.tx.balances?.transferKeepAlive) {
          console.error(
            "transferKeepAlive method not found. Please check API version.",
          );
          return;
        }
        const transaction = api.tx.balances.transferKeepAlive(
          recipientAddress,
          amountInSmallestDenom,
        );

        const injector = await web3FromSource(account.meta.source);
        const hash = await transaction.signAndSend(account.address, {
          signer: injector.signer,
        });
        return hash.toHex();
      }
    } catch (error) {
      console.error("Failed to make a transfer:", error);
    }
  };

  // Fetches the account balance whenever the API or account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (api && account) {
        try {
          const chainInfo = await api.registry.getChainProperties();
          if (chainInfo) {
            const { address } = account;
            const unsubscribe = await api.derive.balances.all(
              address,
              (result) => {
                // Properly format the balance using chain's decimal and symbol information
                const formattedBalance = formatBalance(
                  result.availableBalance,
                  {
                    decimals: chainInfo.tokenDecimals.value[0].toNumber(),
                    withUnit: chainInfo.tokenSymbol.value[0].toString(),
                  },
                );
                setBalance(formattedBalance);
              },
            );

            return () => unsubscribe();
          }
        } catch (error) {
          console.error("Failed to fetch account balance:", error);
        }
      }
    };

    fetchBalance();
  }, [api, account]);

  // Establishes connection to the Substrate node via provided WebSocket URL
  useEffect(() => {
    const connectToSubstrate = async () => {
      try {
        const provider = new WsProvider(providerUrl);
        const substrateApi = await ApiPromise.create({ provider });
        setApi(substrateApi);
      } catch (error) {
        console.error("Failed to connect to Substrate node:", error);
      }
    };

    connectToSubstrate();
  }, [providerUrl]);

  const contextValue = {
    api,
    connectWallet,
    account,
    isConnected,
    balance,
    transfer,
  };

  return (
    <SubstrateContext.Provider value={contextValue}>
      {children}
    </SubstrateContext.Provider>
  );
};

// Custom hook to use the Substrate context
const useWallet = () => {
  const context = useContext(SubstrateContext);
  if (!context) {
    throw new Error("useWallet must be used within a SubstrateProvider");
  }
  return context;
};

export { SubstrateProvider, useWallet };
