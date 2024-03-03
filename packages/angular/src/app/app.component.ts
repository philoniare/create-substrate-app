import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SubstrateService, SubstrateContextType} from "./substrate.service";
import {NgIf} from "@angular/common";

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

  constructor(private substrateService: SubstrateService) {}

  ngOnInit(): void {
    this.substrateService.getContext().subscribe(context => {
      this.context = context;
    })
  }

  connectWallet(): void {
    this.substrateService.connectToSubstrate();
  }
}
