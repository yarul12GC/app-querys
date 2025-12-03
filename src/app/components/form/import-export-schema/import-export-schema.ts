import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-import-export-schema',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './import-export-schema.html',
  styleUrl: './import-export-schema.css',
})
export class ImportExportSchema {
  // Inyección de dependencias
  private fb = inject(FormBuilder);

  // Variable para mostrar el resultado
  generatedQuery: string = '';

  // Definición del Formulario con los campos variables detectados en tu script
  queryForm: FormGroup = this.fb.group({
    owner: [''],                           // El dueño del esquema (ej. TECNISYS)
    tables: [''], // Lista de tablas
    directoryName: [''],                    // Nombre del objeto DIRECTORY en Oracle
    directoryPathSource: [''],       // Ruta física origen (Linux)
    directoryPathDest: [''],  // Ruta física destino (Linux)
    dumpBaseName: [''],     // Nombre base para el archivo .dmp y .log
    ipRemote: [''],                      // IP del servidor destino
    remoteUser: ['']                        // Usuario Linux remoto
  });

  constructor() { }

  generate() {
    // 1. Obtener valores del formulario
    const f = this.queryForm.value;

    // Limpieza básica de espacios
    const owner = f.owner.trim().toUpperCase();
    const dirName = f.directoryName.trim().toUpperCase();
    const dumpName = f.dumpBaseName.trim();
    const pathSrc = f.directoryPathSource.trim(); // Sin slash final idealmente
    const pathDest = f.directoryPathDest.trim();
    const ip = f.ipRemote.trim();
    const rUser = f.remoteUser.trim();

    // 2. Procesar Tablas
    // Entrada esperada: "TABLA1, TABLA2" o "OWNER.TABLA1, OWNER.TABLA2"
    const rawTables = f.tables || '';

    // Para expdp/impdp (Separado por comas, tal cual viene, solo quitando espacios extra)
    const tablesForCommand = rawTables.replace(/\n/g, '').trim();

    // Para SQL (SELECT ... IN ('TABLA1', 'TABLA2'))
    // Asumimos que si el usuario pone "OWNER.TABLA", extraemos solo el nombre de la tabla para el query de DBA_OBJECTS
    // o usamos el string completo si es lo que se requiere. 
    // En tu ejemplo: WHERE OBJECT_NAME IN ('tablas') -> Usualmente requiere solo el nombre sin el owner si ya filtras por owner.

    const tablesArray = rawTables.split(',').map((t: string) => {
      let cleanT = t.trim();
      // Si tiene punto (ESQUEMA.TABLA), tomamos lo que está después del punto para el SQL IN ('...')
      if (cleanT.includes('.')) {
        return cleanT.split('.')[1];
      }
      return cleanT;
    });

    // Unir con comillas para SQL: 'TABLA1', 'TABLA2'
    const tablesForSql = tablesArray.map((t: string) => `'${t}'`).join(', ');


    // 3. Construcción del Template String
    this.generatedQuery = `
    -----------------------------------------------
Validar directorio 

col DIRECTORY_NAME format a25
col DIRECTORY_PATH format a25
COL OWNER for a25
SET LINES 200
SELECT * FROM DBA_DIRECTORIES WHERE DIRECTORY_NAME = '${dirName}';

----------------------------------------

Validar Esquema y tablas

SELECT RPAD(OWNER, 20) AS OWNER, RPAD(OBJECT_NAME, 30) AS OBJECT_NAME 
FROM DBA_OBJECTS 
WHERE OBJECT_NAME IN ${tablesForSql}
AND OWNER = '${owner}';

---------------------------------------------

Validar tablas con su OWNER

COLUMN table_name FORMAT A30
COLUMN owner FORMAT A20

SELECT table_name, owner
FROM all_tables
WHERE table_name IN ${tablesForSql}
  AND owner = '${owner}'
ORDER BY table_name, owner;


---------------------------------------------

VALIDAR EL PESO DE LAS TABLAS

SELECT 
    RPAD(owner, 20) AS ESQUEMA,
    RPAD(segment_name, 30) AS NOMBRE_SEGMENTO,
    ROUND(SUM(bytes) / POWER(1024, 3), 2) AS TAMANO_GB,
    ROUND(SUM(bytes) / POWER(1024, 2), 2) AS TAMANO_MB
FROM 
    dba_segments
WHERE 
    owner = '${owner}'
    AND segment_name IN ${tablesForSql}
GROUP BY 
    owner, segment_name
ORDER BY 
    TAMANO_GB DESC;

-------------------------------------

EXPORT (EXPDP)

nohup expdp \\'/ as sysdba \\' TABLES=${tablesForCommand} 
DIRECTORY=${dirName} COMPRESSION=all 
CONTENT=ALL EXCLUDE=STATISTICS 
DUMPFILE=EXP_${dumpName}.dmp 
LOGFILE=EXP_${dumpName}.log &

-------------------

RESPALDO (EXPDP - BKP)

nohup expdp \\'/ as sysdba \\' TABLES=${tablesForCommand} 
DIRECTORY=${dirName} COMPRESSION=all CONTENT=ALL
 EXCLUDE=STATISTICS DUMPFILE=BKP_${dumpName}.dmp 
 LOGFILE=BKP_${dumpName}.log &

---------------------------

SCP (Transferencia)

scp ${pathSrc}/${dumpName}.dmp ${rUser}@${ip}:${pathDest}

# Para validar relacion de confianza (prueba):
scp ${pathSrc}/${dumpName}.dmp ${ip}:${pathDest} 

-------------------------------

SUMA ORIGEN Y DESTINO (Validación de integridad)

# Origen
sum ${pathSrc}/${dumpName}.dmp

# Destino
sum ${pathDest}/${dumpName}.dmp

-------------------------------

IMPORT (DESTINO)

nohup impdp \\'/ as sysdba \\' TABLES=${tablesForCommand} TABLE_EXISTS_ACTION=REPLACE DIRECTORY=${dirName} DUMPFILE=EXP_${dumpName}.dmp LOGFILE=IMP_${dumpName}.log &
`;
  }
}