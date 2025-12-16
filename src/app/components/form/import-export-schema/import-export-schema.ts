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

    private fb = inject(FormBuilder);

    generatedQuery: string = '';

    queryForm: FormGroup = this.fb.group({
        owner: [''],
        tables: [''],
        directoryName: [''],
        directoryPathSource: [''],
        directoryPathDest: [''],
        dumpBaseName: [''],
        ipRemote: [''],
        remoteUser: ['tismnyl'],
        directoryPathDestBackup: [''],
        remapSchema: [''],
        remapTables: ['']
    });

    constructor() { }

    generate() {

        const f = this.queryForm.value;

        const owner = f.owner.trim().toUpperCase();
        const dirName = f.directoryName.trim().toUpperCase();
        const dumpName = f.dumpBaseName.trim();
        const pathSrc = f.directoryPathSource.trim();
        const pathDest = f.directoryPathDest.trim();
        const ip = f.ipRemote.trim();
        const rUser = f.remoteUser.trim();
        const pathBackup = f.directoryPathDestBackup.trim();
        const remapSchema = f.remapSchema.trim();
        const remapTables = f.remapTables.trim();




        const rawTables: string = f.tables || '';

        const tablesArray: string[] = rawTables
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ',')
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .map(t => {
                if (t.includes('.')) {
                    return t.split('.')[1].toUpperCase();
                }
                return t.toUpperCase();
            });

        const tablesForSql = `(${tablesArray.map(t => `'${t}'`).join(', ')})`;

        const tablesForCommand =
            tablesArray.length > 1
                ? `(${tablesArray.map(t => `${owner}.${t}`).join(',')})`
                : `${owner}.${tablesArray[0]}`;



        const section1 = `
-----------------------------------------------
Validar directorio 

col DIRECTORY_NAME format a25
col DIRECTORY_PATH format a25
COL OWNER for a25
SET LINES 200
SELECT * FROM DBA_DIRECTORIES;
---------------------------------------------`;

        const section2 = `
Validar tablas con su OWNER

COLUMN table_name FORMAT A30
COLUMN owner FORMAT A20

SELECT table_name, owner
FROM all_tables
WHERE table_name IN ${tablesForSql}
  AND owner = '${owner}'
ORDER BY table_name, owner;
---------------------------------------------`;

        const section3 = `
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
-------------------------------------`;

        const section4 = `
EXPORT (EXPDP)

nohup expdp \\'/ as sysdba \\' TABLES=${tablesForCommand} 
DIRECTORY=${dirName}
COMPRESSION=all 
CONTENT=ALL EXCLUDE=STATISTICS 
DUMPFILE=EXP_${dumpName}.dmp 
LOGFILE=EXP_${dumpName}.log &
-------------------`;

        const section5 = `
RESPALDO (EXPDP - BKP)

nohup expdp \\'/ as sysdba \\' TABLES=${tablesForCommand} 
DIRECTORY=${dirName}
COMPRESSION=all CONTENT=ALL
 EXCLUDE=STATISTICS DUMPFILE=BKP_${pathBackup}.dmp 
 LOGFILE=BKP_${pathBackup}.log &
---------------------------`;

        const section6 = `
SCP (Transferencia)

scp ${pathSrc}/${dumpName}.dmp ${rUser}@${ip}:${pathDest}

# Para validar relacion de confianza (prueba):
scp ${pathSrc}/${dumpName}.dmp ${ip}:${pathDest} 
-------------------------------`;

        const section7 = `
SUMA ORIGEN Y DESTINO (Validación de integridad)

# Origen
sum ${pathSrc}/${dumpName}.dmp

# Destino
sum ${pathDest}/${dumpName}.dmp
-------------------------------`;

        const remapSchemaLine = remapSchema
            ? `REMAP_SCHEMA=${remapSchema}\n`
            : '';

        const remapTablesLine = remapTables
            ? `REMAP_TABLESPACE=${remapTables}\n`
            : '';


        const section8 = `
IMPORT (DESTINO)

nohup impdp \\'/ as sysdba \\'
TABLES=${tablesForCommand} 
TABLE_EXISTS_ACTION=REPLACE DIRECTORY=${dirName} ${remapSchemaLine} ${remapTablesLine} COMPRESSION=all CONTENT=ALL 
EXCLUDE=STATISTICS
DUMPFILE=EXP_${dumpName}.dmp LOGFILE=IMP_${dumpName}.log &`;

        let result = '';

        if (dirName) result += section1
        else result += 'FALTAN PARA GENERAR LA PARTE 1,';

        if (dirName && owner && rawTables.trim()) result += section2
        else result += 'FALTAN PARA GENERAR LA PARTE 3,';

        if (dirName && owner && rawTables.trim()) result += section3
        else result += 'FALTAN PARA GENERAR LA PARTE 3,';

        if (dirName && owner && rawTables.trim() && dumpName) result += section4
        else result += 'FALTAN PARA GENERAR LA PARTE 4,';


        if (dirName && rawTables.trim() && dumpName) result += section5
        else result += 'FALTAN PARA GENERAR LA PARTE 5,';


        if (pathSrc && pathDest && ip && rUser && dumpName) result += section6
        else result += 'FALTAN PARA GENERAR LA PARTE 6,';


        if (pathSrc && pathDest && dumpName) result += section7
        else result += 'FALTAN PARA GENERAR LA PARTE 7,';


        if (dirName && rawTables.trim() && dumpName) result += section8
        else result += 'FALTAN PARA GENERAR LA PARTE 8';


        this.generatedQuery = result;
    }
}
