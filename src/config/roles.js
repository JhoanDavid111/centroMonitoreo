// src/config/roles.js
export const ROLES = {
    ADMIN: 'Administrador',
    CONSULTOR_1: 'Consultor 1',
    CONSULTOR_2: 'Consultor 2',
    // ... otros roles
};

export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: ['*'], // Acceso a todo
    [ROLES.CONSULTOR_1]: ['dashboard', 'reportes'],
    [ROLES.CONSULTOR_2]: ['dashboard'],
    // ... otros permisos
};