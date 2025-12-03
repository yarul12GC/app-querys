import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
interface HomeButonsSidebar {
  title: string,
  url: string
  classBtn: string
}
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  
  homeButonsSidebar: HomeButonsSidebar[] = [
    {
      title: 'Home',
      url: '/Home',
      classBtn: 'btnUser'
    },
    {
      title: 'Users',
      url: '/QueryUsers',
      classBtn: 'btnUser'
    },

    {
      title: 'Import & Export Esquema',
      url: '/QueryEschema',
      classBtn: 'btn btn-primary'

    },
    {
      title: 'Import & Export Tablas',
      url: '/QueryTables',
      classBtn: 'btnUser'

    }
  ]
}
