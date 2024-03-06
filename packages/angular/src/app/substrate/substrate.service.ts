import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { formatBalance } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { CHAIN_PROVIDERS } from './chains';

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

  getContext(): Observable<SubstrateContextType> {
    return this.context.asObservable();
  }

  public async connectToSubstrate(
    appName: string,
    chain: string,
  ): Promise<string | undefined> {
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

  private async fetchBalance(
    api: ApiPromise,
    account: InjectedAccountWithMeta,
  ): Promise<void> {
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

  public async transfer(
    recipientAddress: string,
    amount: string,
  ): Promise<HexString | undefined> {
    try {
      const amountInSmallestDenom = parseFloat(amount);
      const account = this.context.getValue().account;
      const api = this.context.getValue().api;
      if (api && account) {
        if (!api.tx['balances']['transferKeepAlive']) {
          console.error(
            'transferKeepAlive method not found. Please check API version.',
          );
          return;
        }
        const transaction = api.tx['balances']['transferKeepAlive'](
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
      console.error('Failed to make a transfer:', error);
    }
    return undefined;
  }

  private updateContext(partial: Partial<SubstrateContextType>): void {
    this.context.next({ ...this.context.value, ...partial });
  }
}
