// SubstrateContext.ts
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
import { encodeAddress } from '@polkadot/util-crypto';
import { CHAIN_PROVIDERS } from "./chains";

/**
 * Defines the shape of the Substrate context.
 */
interface SubstrateContextValue {
  api: ApiPromise | null;
  connectWallet: () => Promise<void>;
  accounts: InjectedAccountWithMeta[] | null;
  isConnected: boolean;
  fetchBalance: (address: string) => Promise<string>;
  transfer: (
    recipientAddress: string,
    amount: string,
    account: InjectedAccountWithMeta,
  ) => Promise<HexString | undefined>;
  chain: string;
  formatAddressForChain: (address: string | undefined) => string;
}

/**
 * Defines the props for the SubstrateProvider component.
 */
interface SubstrateProviderProps {
  children: ReactNode;
  chain: string;
  appName: string;
}

/**
 * Creates a context for Substrate API interaction.
 */
export const SubstrateContext = createContext<SubstrateContextValue | null>(
  null,
);

/**
 * Provides the Substrate context to the application.
 */
export const SubstrateProvider: React.FC<SubstrateProviderProps> = ({
  children,
  chain,
  appName,
}) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);

  /**
   * Connects to the Polkadot{.js} extension and subscribes to account changes.
   */
  const connectWallet = async () => {
    try {
      await web3Enable(appName);
      await web3AccountsSubscribe(
        (injectedAccounts: InjectedAccountWithMeta[]) => {
          if (injectedAccounts.length > 0) {
            setAccounts(injectedAccounts);
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

  /**
   * Formats a generic address to the specific format used by the current chain.
   * @param address The generic address to be formatted.
   * @returns The formatted address compatible with the current chain.
   */
  const formatAddressForChain = (address: string | undefined) => {
    return address ? encodeAddress(address, CHAIN_PROVIDERS[chain].prefix) : '';
  };

  /**
   * Transfers funds from the connected account to the specified recipient address.
   * @param recipientAddress The address of the recipient.
   * @param amount The amount to transfer in the smallest denomination of the chain's native token.
   * @param account The account to transfer from.
   * @returns The transaction hash if successful, undefined otherwise.
   */
  const transfer = async (
    recipientAddress: string,
    amount: string,
    account: InjectedAccountWithMeta,
  ) => {
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

  /**
   * Fetches the account balance whenever the API or account changes.
   * @param address The address of the wallet to query the balance.
   * @returns The formatted balance as a string.
   */
  const fetchBalance = async (address: string): Promise<string> => {
    if (api && accounts) {
      try {
        const chainInfo = await api.registry.getChainProperties();
        if (chainInfo) {
          return new Promise((resolve, reject) => {
            api.derive.balances.all(address, (result) => {
              if (result) {
                // Properly format the balance using chain's decimal and symbol information
                const formattedBalance = formatBalance(result.availableBalance, {
                  decimals: chainInfo.tokenDecimals.value[0].toNumber(),
                  withUnit: chainInfo.tokenSymbol.value[0].toString(),
                });
                resolve(formattedBalance as string);
              } else {
                reject(new Error('Failed to fetch balance'));
              }
            });
          });
        }
      } catch (error) {
        console.error("Failed to fetch account balance:", error);
      }
    }
    return "";
  };

  /**
   * Establishes a connection to the Substrate node via the provided WebSocket URL.
   */
  useEffect(() => {
    const connectToSubstrate = async () => {
      try {
        const provider = new WsProvider(CHAIN_PROVIDERS[chain].rpc);
        const substrateApi = await ApiPromise.create({ provider });
        setApi(substrateApi);
      } catch (error) {
        console.error("Failed to connect to Substrate node:", error);
      }
    };

    connectToSubstrate();
  }, [chain]);

  const contextValue: SubstrateContextValue = {
    api,
    connectWallet,
    accounts,
    isConnected,
    fetchBalance,
    transfer,
    chain,
    formatAddressForChain,
  };

  return (
    <SubstrateContext.Provider value={contextValue}>
      {children}
    </SubstrateContext.Provider>
  );
};

/**
 * Custom hook to use the Substrate context.
 * @throws {Error} If used outside of a SubstrateProvider component.
 */
export const useWallet = () => {
  const context = useContext(SubstrateContext);
  if (!context) {
    throw new Error("useWallet must be used within a SubstrateProvider");
  }
  return context;
};
