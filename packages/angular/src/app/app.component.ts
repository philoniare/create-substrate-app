import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SubstrateService,
  SubstrateContextValue,
} from './substrate/substrate.service';
import {NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {CHAIN_PROVIDERS} from "./substrate/chains";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Substrate Angular App';
  context: SubstrateContextValue | null = null;
  appName = environment.appName || 'my-app';
  chain = environment.chain || 'default';
  selectedAccount: InjectedAccountWithMeta | null = null;
  toAddress: string = '';
  amount: string = '0';
  tranHash: string = '';

  constructor(private substrateService: SubstrateService) {}

  ngOnInit(): void {
    this.substrateService.getContext().subscribe((context) => {
      this.context = context;
    });
  }

  async connectWallet(): Promise<void> {
    const address = await this.substrateService.connectToSubstrate(
      this.appName,
      this.chain,
    );
    if (address) {
      this.toAddress = address;
    }
  }

  async onSubmit(): Promise<void> {
    const hash = await this.substrateService.transfer(
      this.toAddress,
      this.amount,
    );
    if (hash) {
      this.tranHash = hash;
    }
  }

  async onAccountChange(): Promise<void> {
    if (this.selectedAccount) {
      await this.substrateService.setSelectedAccount(this.selectedAccount);
    }
  }

  getLogoPath(): string {
    return CHAIN_PROVIDERS[this.chain]?.logo || '';
  }
}
