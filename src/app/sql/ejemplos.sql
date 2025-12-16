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