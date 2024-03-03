import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { formatBalance } from '@polkadot/util';

export interface SubstrateContextType {
  api: ApiPromise | null;
  account: InjectedAccountWithMeta | null;
  isConnected: boolean;
  balance: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubstrateService {
  private context = new BehaviorSubject<SubstrateContextType>({
    api: null,
    account: null,
    isConnected: false,
    balance: '',
  });

  constructor() {
  }

  getContext(): Observable<SubstrateContextType> {
    return this.context.asObservable();
  }

  public async connectToSubstrate(): Promise<void> {
    try {
      const providerUrl = 'wss://1rpc.io/dot'; // Move to environment variable if needed
      const appName = 'Angular Substrate App'; // Move to environment variable if needed
      await web3Enable(appName);

      const accounts = await web3Accounts();
      if (accounts.length > 0) {
        const provider = new WsProvider(providerUrl);
        const api = await ApiPromise.create({ provider });
        this.updateContext({ api, account: accounts[0], isConnected: true });

        this.fetchBalance(api, accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }

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

  private updateContext(partial: Partial<SubstrateContextType>): void {
    this.context.next({ ...this.context.value, ...partial });
  }
}
