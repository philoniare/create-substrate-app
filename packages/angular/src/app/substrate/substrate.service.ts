import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { formatBalance } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { CHAIN_PROVIDERS } from './chains';

/**
 * Defines the shape of the Substrate context.
 */
export interface SubstrateContextValue {
  api: ApiPromise | null;
  account: InjectedAccountWithMeta | null;
  isConnected: boolean;
  balance: string;
}

/**
 * A service that provides interaction with the Substrate blockchain.
 */
@Injectable({
  providedIn: 'root',
})
export class SubstrateService {
  private context = new BehaviorSubject<SubstrateContextValue>({
    api: null,
    account: null,
    isConnected: false,
    balance: '',
  });

  /**
   * Returns an observable of the current Substrate context.
   */
  getContext(): Observable<SubstrateContextValue> {
    return this.context.asObservable();
  }

  /**
   * Connects to the Substrate blockchain using the specified app name and chain.
   * @param appName The name of the application.
   * @param chain The name of the chain to connect to.
   * @returns The address of the connected account, or undefined if the connection fails.
   */
  public async connectToSubstrate(appName: string, chain: string): Promise<string | undefined> {
    try {
      const providerUrl = CHAIN_PROVIDERS[chain];
      await web3Enable(appName);

      const accounts = await web3Accounts();
      if (accounts.length > 0) {
        const provider = new WsProvider(providerUrl);
        const api = await ApiPromise.create({ provider });
        const address = accounts[0].address;
        this.updateContext({ api, account: accounts[0], isConnected: true });
        this.fetchBalance(api, accounts[0]);
        return address;
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
    return undefined;
  }

  /**
   * Fetches the balance of the connected account.
   * @param api The Substrate API instance.
   * @param account The connected account.
   */
  private async fetchBalance(api: ApiPromise, account: InjectedAccountWithMeta): Promise<void> {
    try {
      const { address } = account;
      const chainInfo = await api.registry.getChainProperties();
      const result = await api.derive.balances.all(address);
      const balance = formatBalance(result.availableBalance, {
        decimals: chainInfo?.tokenDecimals.unwrap()[0].toNumber(),
        withUnit: chainInfo?.tokenSymbol.unwrap()[0].toString(),
      });
      this.updateContext({ balance });
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }

  /**
   * Transfers funds from the connected account to the specified recipient address.
   * @param recipientAddress The address of the recipient.
   * @param amount The amount to transfer in the smallest denomination of the chain's native token.
   * @returns The transaction hash if successful, undefined otherwise.
   */
  public async transfer(recipientAddress: string, amount: string): Promise<HexString | undefined> {
    try {
      const amountInSmallestDenom = parseFloat(amount);
      const account = this.context.getValue().account;
      const api = this.context.getValue().api;
      if (api && account) {
        if (!api.tx['balances']['transferKeepAlive']) {
          console.error('transferKeepAlive method not found. Please check API version.');
          return;
        }
        const transaction = api.tx['balances']['transferKeepAlive'](recipientAddress, amountInSmallestDenom);

        const injector = await web3FromSource(account.meta.source);
        const hash = await transaction.signAndSend(account.address, {
          signer: injector.signer,
        });
        return hash.toHex();
      }
    } catch (error) {
      console.error('Failed to make a transfer:', error);
    }
    return undefined;
  }

  /**
   * Updates the Substrate context with partial values.
   * @param partial The partial values to update the context with.
   */
  private updateContext(partial: Partial<SubstrateContextValue>): void {
    this.context.next({ ...this.context.value, ...partial });
  }
}
