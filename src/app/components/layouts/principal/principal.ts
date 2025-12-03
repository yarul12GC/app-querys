import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Headerr } from "../../shared/headerr/headerr";
import { Footer } from "../../shared/footer/footer";
import { Sidebar } from "../../shared/sidebar/sidebar";

@Component({
  selector: 'app-principal',
  imports: [RouterOutlet, Footer, Sidebar],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export default class Principal {


}
