Este es del esquema, te puse un ejemplo de cada uno para que más o menos le entiendas como debe de quedar 



Validra esquema:

SELECT username AS esquema
FROM dba_users
WHERE username = '(nombre del esquema)';

---------------------------------

VALIDAR ESQUEMA/ OWNER Y VALIDAR EL PESO DEL ESQUEMA EN  GB y MB

SELECT 
    RPAD(owner, 20) AS esquema,
    RPAD(owner, 20) AS owner,
    ROUND(SUM(bytes) / POWER(1024, 3), 2) AS tamano_gb,
    ROUND(SUM(bytes) / POWER(1024, 2), 2) AS tamano_mb
FROM 
    dba_segments
WHERE 
    owner = '(esquema)'
GROUP BY 
    owner
ORDER BY 
    tamano_gb DESC;

--------------------------

ORIGEN

EXPORT
nohup expdp \'/ as sysdba \' SCHEMAS=(nombre_esquema) DIRECTORY=(nombre_directorio) CONTENT=ALL  COMPRESSION= ALL DUMPFILE=EXP_(nombre).dmp LOGFILE=EXP_(nombre).log &

EJEMPLO 
nohup expdp \'/ as sysdba \' SCHEMAS=ACCE DIRECTORY=DIR_EXP CONTENT=ALL  COMPRESSION= ALL DUMPFILE=EXP_ACCE_SCHEMA271025.dmp LOGFILE=EXP_ACCE_SCHEMA271025.log &


DESTINO
RESPALDOS
nohup expdp \'/ as sysdba \' SCHEMAS=(nombre_esquema) DIRECTORY=(nombre_directorio) CONTENT=ALL EXCLUDE=STATISTICS COMPRESSION= ALL DUMPFILE=BKP_(nombre).dmp LOGFILE=BKP_(nombre).log &

EJEMPLO
nohup expdp \'/ as sysdba \' SCHEMAS=ACCE DIRECTORY=DIR_EXP CONTENT=ALL EXCLUDE=STATISTICS COMPRESSION= ALL DUMPFILE=BKP_ACCE_SCHEMA271025.dmp LOGFILE=BKP_ACCE_SCHEMA271025.log &


IMPORT
nohup impdp \'/ as sysdba \' DIRECTORY=(nombre) DUMPFILE=EXP_(nombre).dmp LOGFILE=IMP_(nombre).log &

EJEMPLO
nohup impdp \'/ as sysdba \' DIRECTORY=DIR_EXP DUMPFILE=EXP_ACCE_SCHEMA271025.dmp LOGFILE=IMP_ACCE_SCHEMA271025.log &









Validar directorio *paso1*

col DIRECTORY_NAME format a25
col DIRECTORY_PATH format a25
COL OWNER for a25
SET LINES 200
SELECT * FROM DBA_DIRECTORIES;

----------------------------------------
Validar si existe directorio *paso2*

col DIRECTORY_NAME format a25
col DIRECTORY_PATH format a25
COL OWNER for a25
SET LINES 200
SELECT * FROM DBA_DIRECTORIES WHERE DIRECTORY_NAME = 'EXPORT';

---------------------------------------------
Validar tablas con su OWNER *paso3*

COLUMN table_name FORMAT A30
COLUMN owner FORMAT A20

SELECT table_name, owner
FROM all_tables
WHERE table_name IN 'ADT_ENTRADA', 'ASEGURADOS'
  AND owner = 'COTIZADOR'
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
    owner = 'COTIZADOR'
    AND segment_name IN 'ADT_ENTRADA', 'ASEGURADOS'
GROUP BY 
    owner, segment_name
ORDER BY 
    TAMANO_GB DESC;

-------------------------------------

export

nohup expdp \'/ as sysdba \' TABLES=(OWNER.NOMBRE_TABLE) DIRECTORY=(NOMBRE_DIRECTORIO) COMPRESSION=all CONTENT=ALL EXCLUDE=STATISTICS DUMPFILE=EXP_().dmp LOGFILE=EXP_(nombre).log &

-------------------

resplado
nohup expdp \'/ as sysdba \' TABLES=(OWNER.NOMBRE_TABLE) DIRECTORY=(NOMBRE_DIRECTORIO) COMPRESSION=all CONTENT=ALL EXCLUDE=STATISTICS DUMPFILE=BKP_().dmp LOGFILE=BKP_(nombre).log &

---------------------------

SCP
scp (directory_path)/(nombre.dmp) tismnyl@(ip):(directory_path)

scp (directory_path)/(nombre.dmp) (IP):(directory_path) (para validar relacion de confianza) 

-------------------------------


Suma origen y destino 
sum (directory_path)/(nombre.dmp) (origen con la ruta que le dimos, es para ver la sumatoria que esten iguales, no tenemos que setearnos, se puede lanzar normal)
sum (directory_path)/(nombre.dmp) (destino con la ruta que le dimos , es para ver la sumatoria que esten iguales, no tenemos que setearnos, se puede lanzar normal)


IMPORT (DESTINO)
nohup impdp \'/ as sysdba \'  TABLES=(OWNER.NOMBRE_TABLE) TABLE_EXISTS_ACTION=REPLACE DIRECTORY=(NOMBRE_DIRECTORIO) DUMPFILE=EXP_(NOMBRE.dmp) LOGFILE=IMP_(NOMBRE.log) &