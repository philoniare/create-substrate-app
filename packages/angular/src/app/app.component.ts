import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SubstrateService,
  SubstrateContextValue,
} from './substrate/substrate.service';
import { NgIf } from '@angular/common';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Substrate Angular App';
  context: SubstrateContextValue | null = null;
  appName = environment.appName || 'my-app';
  chain = environment.chain || 'default';
  toAddress: string = '';
  amount: string = '';
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
}
