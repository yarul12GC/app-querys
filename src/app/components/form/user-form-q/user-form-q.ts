import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
// import { SectionQuery } from "../section-query/section-query"; // Descomenta esto si tienes el componente

@Component({
  selector: 'app-user-form-q',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Agregamos ReactiveFormsModule
  templateUrl: './user-form-q.html',
  styleUrl: './user-form-q.css',
})
export class UserFormQ {
  // Inyección de dependencias
  private fb = inject(FormBuilder);

  // Variables de estado para la UI
  isOpenPermisos = false;
  isOpenObjetos = false;
  generatedQuery: string = '';

  // Listas de datos (Ejemplos, puedes cargarlos de una API)
  permisosList: string[] = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'EXECUTE', 'DEBUG'];
  objetosList: string[] = ['TABLE', 'VIEW', 'TABLE SUBPARTITION', 'TABLE PARTITION', 'MATERIALIZED VIEW','SYNONYM'];

  // Definición del Formulario
  queryForm: FormGroup = this.fb.group({
    username: [''],
    role: [''],          // Input texto simple según tu HTML
    profile: ['DEFAULT'],
    cloneFromUser: [''],
    passwordLength: [12],
    database: ['ORCL'],
    schema: [''],
    permissions: this.fb.array([]), // Array para los checkboxes
    objects: this.fb.array([])      // Array para los checkboxes
  });

  constructor() { }

  // --- Lógica de UI (Dropdowns) ---
  toggleDropdown(type: 'permisos' | 'objetos') {
    if (type === 'permisos') {
      this.isOpenPermisos = !this.isOpenPermisos;
      this.isOpenObjetos = false; // Cierra el otro
    } else {
      this.isOpenObjetos = !this.isOpenObjetos;
      this.isOpenPermisos = false; // Cierra el otro
    }
  }

  // --- Lógica de Checkboxes ---
  onCheckboxChange(e: any, controlName: 'permissions' | 'objects') {
    const checkArray: FormArray = this.queryForm.get(controlName) as FormArray;

    if (e.target.checked) {
      // Agregar al array si se selecciona
      checkArray.push(new FormControl(e.target.value));
    } else {
      // Buscar y remover del array si se deselecciona
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // --- Generador de Contraseña Aleatoria ---
  generateRandomPassword(length: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  // --- Generación del Query ---
  generate() {
    // 1. Obtener valores del formulario
    const f = this.queryForm.value;

    // 2. Mapeo de variables simples
    const user = f.username ? f.username.toUpperCase() : 'USER_X';
    const role = f.role ? f.role.toUpperCase() : '';
    const profile = f.profile ? f.profile.toUpperCase() : 'DEFAULT';
    const cloneUser = f.cloneFromUser ? f.cloneFromUser.toUpperCase() : '';
    const dbName = f.database ? f.database.toUpperCase() : 'DB';

    // 3. Generar contraseña dinámica
    const generatedPassword = this.generateRandomPassword(f.passwordLength || 12);

    // 4. Formatear arrays (permisos y objetos) para mostrarlos en el script si es necesario
    // Nota: El script original no usa explícitamente los checkboxes seleccionados en el string SQL,
    // pero aquí los preparo por si quieres agregarlos después (ej. GRANT SELECT ON TABLE...).
    const selectedPermissions = f.permissions.join(', ');

    // 5. Construcción del Template String
    // NOTA: He mantenido tu estructura exacta.

    this.generatedQuery = `
**********************************************************************************
VALIDAR
**********************************************************************************
SET LINES 200
SET PAGESIZE 5
COL HOST_NAME FOR A25
COL PROFILE FOR A25
COL USERNAME FOR A25
SELECT TO_CHAR(sysdate,'DD-MM-YYYY HH24:MI:SS') FROM DUAL;
SELECT INSTANCE_NAME, HOST_NAME, VERSION, STARTUP_TIME, STATUS, DATABASE_STATUS FROM V$INSTANCE;
SELECT USERNAME, EXPIRY_DATE, ACCOUNT_STATUS, PROFILE FROM DBA_USERS WHERE USERNAME IN ('${user}');

**********************************************************************************
ALTA DE USUARIO(S)
**********************************************************************************
CREATE USER "${user}" IDENTIFIED BY "${generatedPassword}";
GRANT CREATE SESSION, CONNECT, ${role} TO "${user}";
ALTER USER "${user}" PROFILE ${profile};

**********************************************************************************
VALIDAR ROL(ES) DE USUARIO(S)
**********************************************************************************
SET PAGESIZE 4
COL GRANTEE FOR A25
COL GRANTED_ROLE FOR A25
SELECT GRANTEE, GRANTED_ROLE FROM DBA_ROLE_PRIVS WHERE GRANTEE IN ('${user}')  AND GRANTED_ROLE IN ('${role}');

**********************************************************************************
CONTEO DE PERMISOS DE: ${cloneUser} (CLONADO)
**********************************************************************************
COL OWNER FOR A25
COL GRANTEE FOR A25
COL PRIVILEGE FOR A25
SELECT DISTINCT P.OWNER ,P.GRANTEE, O.OBJECT_TYPE,P.PRIVILEGE ,COUNT(*)
FROM DBA_TAB_PRIVS P, DBA_OBJECTS O
WHERE P.TABLE_NAME = O.OBJECT_NAME AND P.OWNER = O.OWNER
AND P.GRANTEE IN ('${cloneUser}')
GROUP BY P.OWNER,O.OBJECT_TYPE,P.PRIVILEGE, P.GRANTEE ORDER BY P.GRANTEE;

**********************************************************************************
QUERY PARA GENERAR PERMISOS (Basado en ${cloneUser})
**********************************************************************************
SET PAGESIZE 0
SELECT DISTINCT 'GRANT '||PRIVILEGE||' ON '||OWNER||'."'||TABLE_NAME||'" TO "${user}";' AS "PERMISOS"
FROM DBA_TAB_PRIVS
WHERE GRANTEE IN ('${cloneUser}');

**********************************************************************************
VALIDAR PERMISOS QUE SE OTORGARON A: ${user}
**********************************************************************************
COL OWNER FOR A25
COL GRANTEE FOR A25
COL PRIVILEGE FOR A25
SELECT DISTINCT P.OWNER ,P.GRANTEE, O.OBJECT_TYPE,P.PRIVILEGE ,COUNT(*)
FROM DBA_TAB_PRIVS P, DBA_OBJECTS O
WHERE P.TABLE_NAME = O.OBJECT_NAME AND P.OWNER = O.OWNER
AND P.GRANTEE IN ('${user}')
GROUP BY P.OWNER,O.OBJECT_TYPE,P.PRIVILEGE, P.GRANTEE ORDER BY P.GRANTEE;

**********************************************************************************
PRUEBAS DE CONEXIÓN
**********************************************************************************
CONN "${user}"/"${generatedPassword}"@${dbName}
SHOW USER

**********************************************************************************
CREDENCIALES
**********************************************************************************
USUARIO: ${user}
CONTRASEÑA: ${generatedPassword}
PERFIL ASIGNADO: ${profile}
`;
  }
}