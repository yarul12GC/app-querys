import { Component } from '@angular/core';
import { ImportExportSchema } from "../../form/import-export-schema/import-export-schema";

@Component({
  selector: 'app-query-tables',
  imports: [ImportExportSchema],
  templateUrl: './query-tables.html',
  styleUrl: './query-tables.css',
})
export default class QueryTables {

}
