// src/utils/rbac.ts

export const ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const canAccess = (userRole: string | null, allowedRoles: Role[]) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as Role);
};