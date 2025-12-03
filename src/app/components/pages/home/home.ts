import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
interface HomeButons {
  title: string,
  url: string
  classBtn: string
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export default class Home {

  homeButons: HomeButons[] = [
    {
      title: 'Users',
      url: '/QueryUsers',
      classBtn: 'btn btn-outline-info'
    },
    // {
    //   title: 'Despk',
    //   url: '/despk',
    //   classBtn: 'btn btn-primary'
    // },
    {
      title: 'Import & Export Esquema',
      url: '/QueryEschema',
      classBtn: 'btn btn-outline-primary'

    },
    {
      title: 'Import & Export Tablas',
      url: '/QueryTables',
      classBtn: 'btn btn-outline-dark'

    }
  ]

}
