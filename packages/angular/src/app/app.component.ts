import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SubstrateService, SubstrateContextType} from "./substrate/substrate.service";
import {NgIf} from "@angular/common";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Substrate Angular App';
  context: SubstrateContextType | null = null;
  appName = environment.appName;
  chain = environment.chain;

  constructor(private substrateService: SubstrateService) {}

  ngOnInit(): void {
    this.substrateService.getContext().subscribe(context => {
      this.context = context;
    })
  }

  connectWallet(): void {
    this.substrateService.connectToSubstrate(this.appName, this.chain);
  }
}
