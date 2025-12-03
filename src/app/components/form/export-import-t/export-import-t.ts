import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-import-t',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './export-import-t.html',
  styleUrl: './export-import-t.css',
})
export  class ExportImportT {
  // Inyección de dependencias
  private fb = inject(FormBuilder);

  // Variable para mostrar el resultado
  generatedQuery: string = '';

  // Formulario con los 3 campos variables identificados en tu script
  queryForm: FormGroup = this.fb.group({
    schema: [''],              // Variable: (nombre del esquema) / (esquema)
    directory: [''],        // Variable: (nombre_directorio)
    dumpBaseName: [''] // Variable: (nombre) para el .dmp y .log
  });

  constructor() { }

  // --- Generación del Script ---
  generate() {
    const f = this.queryForm.value;
    
    // Limpieza y estandarización (Mayúsculas para Oracle)
    const schema = f.schema ? f.schema.trim().toUpperCase() : 'SCHEMA_NAME';
    const dir = f.directory ? f.directory.trim().toUpperCase() : 'DIR_OBJ';
    const dump = f.dumpBaseName ? f.dumpBaseName.trim() : 'DUMP_NAME';

    // Construcción del Template String exacto
    this.generatedQuery = `
VALIDAR ESQUEMA:

SELECT username AS esquema
FROM dba_users
WHERE username = '${schema}';

---------------------------------

VALIDAR ESQUEMA/ OWNER Y VALIDAR EL PESO DEL ESQUEMA EN GB y MB

SELECT 
    RPAD(owner, 20) AS esquema,
    RPAD(owner, 20) AS owner,
    ROUND(SUM(bytes) / POWER(1024, 3), 2) AS tamano_gb,
    ROUND(SUM(bytes) / POWER(1024, 2), 2) AS tamano_mb
FROM 
    dba_segments
WHERE 
    owner = '${schema}'
GROUP BY 
    owner
ORDER BY 
    tamano_gb DESC;

--------------------------

ORIGEN

EXPORT
nohup expdp \\'/ as sysdba \\' SCHEMAS=${schema} DIRECTORY=${dir} CONTENT=ALL  COMPRESSION=ALL DUMPFILE=EXP_${dump}.dmp LOGFILE=EXP_${dump}.log &

--------------------------

DESTINO - RESPALDOS

nohup expdp \\'/ as sysdba \\' SCHEMAS=${schema} DIRECTORY=${dir} CONTENT=ALL EXCLUDE=STATISTICS COMPRESSION=ALL DUMPFILE=BKP_${dump}.dmp LOGFILE=BKP_${dump}.log &

--------------------------

IMPORT

nohup impdp \\'/ as sysdba \\' DIRECTORY=${dir} DUMPFILE=EXP_${dump}.dmp LOGFILE=IMP_${dump}.log &
`;
  }
}