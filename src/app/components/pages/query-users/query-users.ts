import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormQ } from '../../form/user-form-q/user-form-q';

@Component({
  selector: 'app-query-users',
  imports: [UserFormQ],
  templateUrl: './query-users.html',
  styleUrl: './query-users.css',
})
export default class QueryUsers {

}
