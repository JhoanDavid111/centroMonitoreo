import { use } from "react";

// src/config/roles.js
export const ROLES = {
    ADMIN: 'Administrador',
    CONSULTOR_1: 'Consultor1',
    CONSULTOR_2: 'Consultor2',
    // ... otros roles
};

//Definir permisos como constantes para evitar errores de escritura
export const PERMISSIONS={
    DASHBOARD: 'dashboard',
    REPORTES: 'reportes',
    TRANSMISION: 'transmision',
    PROYECTOS: 'proyectos',
    COMUNIDADES: 'comunidades',
    TRANSMISION_PAGES: 'transmisionpages'
}

export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: ['*'], // Acceso a todo
    [ROLES.CONSULTOR_1]: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.REPORTES,
        PERMISSIONS.TRANSMISION,
        PERMISSIONS.PROYECTOS
        ],
    [ROLES.CONSULTOR_2]: [
        PERMISSIONS.DASHBOARD
    ],
    // ... otros permisos
};

//Función helper para verificar permisos
export const hasPermission=(userRole,requieredPermission)=>{
    if(!useRole || !ROLE_PERMISSIONS[userRole]) return false;

    const userPermissions= ROLE_PERMISSIONS[userRole];

    //Si tiene acceso a todo
    if(userPermissions.includes('*')) return true;

    //Verificar permiso especifico
    return userPermissions.includes(requieredPermission);

};

//Función para verificar roles
export const hasRole = (userRole, allowedRoles=[])=>{
    if(!useRole || allowedRoles.length===0) return true;
    return allowedRoles.includes(userRole);
};
