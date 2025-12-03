export nohup expdp \ '/ as sysdba \' 
TABLES=TECNISYS.CAT_PLANTILLA_AIMP, 
TECNISYS.CAT_TEXTO_DAUT, 
TECNISYS.HIS_OPE_PARAM_GRAL, 
TECNISYS.MONEDAS_CAMBIO, 
TECNISYS.OPE_PARAM_GRAL,
TECNISYS.PAR_CATALOGO_HIST_VALO, 
TECNISYS.PAR_INTE_MULTIFON DIRECTORY=EXPDMP COMPRESSION=all CONTENT=ALL EXCLUDE=STATISTICS DUMPFILE=EXP_TECNISYS_TABLAS07112025.dmp LOGFILE=TECNISYS_TABLAS07112025.log &


resplado
nohup expdp \'/ as sysdba \' TABLES=TECNISYS.CAT_PLANTILLA_AIMP, TECNISYS.CAT_TEXTO_DAUT, TECNISYS.HIS_OPE_PARAM_GRAL, TECNISYS.MONEDAS_CAMBIO, TECNISYS.OPE_PARAM_GRAL, TECNISYS.PAR_CATALOGO_HIST_VALO, TECNISYS.PAR_INTE_MULTIFON DIRECTORY=DIR_EXP COMPRESSION=all CONTENT=ALL EXCLUDE=STATISTICS DUMPFILE=BKP_TECNISYS_TABLAS07112025.dmp LOGFILE=BKP_TECNISYS_TABLAS07112025.log &

SCP
scp /oracle19c/exp/EXP_TECNISYS_TABLAS07112025.dmp tismnyl@10.198.0.5:/backupdb/preprod/dmp

scp /oracle19c/exp/EXP_TECNISYS_TABLAS07112025.dmp 10.198.0.5:/backupdb/preprod/dmp (para validar relacion de confianza) 


Suma origen y destino 
sum /oracle19c/exp/EXP_TECNISYS_TABLAS07112025.dmp (origen con la ruta que le dimos, es para ver la sumatoria que esten iguales, no tenemos que setearnos, se puede lanzar normal)
sum /backupdb/preprod/dmp/EXP_TECNISYS_TABLAS07112025.dmp (destino con la ruta que le dimos , es para ver la sumatoria que esten iguales, no tenemos que setearnos, se puede lanzar normal)


IMPORT (DESTINO)
nohup impdp \'/ as sysdba \'  TABLES=TECNISYS.CAT_PLANTILLA_AIMP, TECNISYS.CAT_TEXTO_DAUT, TECNISYS.HIS_OPE_PARAM_GRAL, TECNISYS.MONEDAS_CAMBIO, TECNISYS.OPE_PARAM_GRAL, TECNISYS.PAR_CATALOGO_HIST_VALO, TECNISYS.PAR_INTE_MULTIFON TABLE_EXISTS_ACTION=REPLACE DIRECTORY=DIR_EXP DUMPFILE=EXP_TECNISYS_TABLAS07112025.dmp LOGFILE=IMP_TECNISYS_TABLAS07112025.log &



col DIRECTORY_NAME format a25
col DIRECTORY_PATH format a25
COL OWNER for a25
SET LINES 200
SELECT * FROM DBA_DIRECTORIES;

----------------------------------------


Validar Esquema y tablas

SELECT RPAD(OWNER, 20) AS OWNER, RPAD(OBJECT_NAME, 30) AS OBJECT_NAME 
FROM DBA_OBJECTS 
WHERE OBJECT_NAME IN ('tablas') 
AND OWNER = '(owner)';

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
    owner = '(owner)'
    AND segment_name IN ('tablas')
GROUP BY 
    owner, segment_name
ORDER BY 
    owner, Tamano_GB DESC;

-------------------------------------

export

nohup expdp \'/ as sysdba \' TABLES=(OWNER_NOMBRE_TABLE) DIRECTORY=(NOMBRE_DIRECTORIO) COMPRESSION=all CONTENT=ALL EXCLUDE=STATISTICS DUMPFILE=EXP_().dmp LOGFILE=EXP_(nombre).log &

-------------------

resplado
nohup expdp \'/ as sysdba \' TABLES=(OWNER_NOMBRE_TABLE) DIRECTORY=(NOMBRE_DIRECTORIO) COMPRESSION=all CONTENT=ALL EXCLUDE=STATISTICS DUMPFILE=BKP_().dmp LOGFILE=BKP_(nombre).log &

---------------------------

SCP
scp (directory_path)/(nombre.dmp) tismnyl@(ip):(directory_path)

scp (directory_path)/(nombre.dmp) (IP):(directory_path) (para validar relacion de confianza) 

-------------------------------


Suma origen y destino 
sum (directory_path)/(nombre.dmp) (origen con la ruta que le dimos, es para ver la sumatoria que esten iguales, no tenemos que setearnos, se puede lanzar normal)
sum (directory_path)/(nombre.dmp) (destino con la ruta que le dimos , es para ver la sumatoria que esten iguales, no tenemos que setearnos, se puede lanzar normal)


IMPORT (DESTINO)
nohup impdp \'/ as sysdba \'  TABLES=(OWNER_NOMBRE_TABLE) TABLE_EXISTS_ACTION=REPLACE DIRECTORY=(NOMBRE_DIRECTORIO) DUMPFILE=EXP_(NOMBRE.dmp) LOGFILE=IMP_(NOMBRE.log) &