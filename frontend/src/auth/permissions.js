import { ROLES } from './roles';

export const PERMISSIONS = {
  // Admin permissions
  VIEW_ALL_ANALYTICS: 'view_all_analytics',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  
  // Doctor permissions
  VIEW_PATIENT_RECORDS: 'view_patient_records',
  WRITE_PRESCRIPTIONS: 'write_prescriptions',
  WRITE_NOTES: 'write_notes',
  REVIEW_REPORTS: 'review_reports',
  MANAGE_OWN_APPOINTMENTS: 'manage_own_appointments',
  
  // Patient permissions
  VIEW_OWN_RECORDS: 'view_own_records',
  BOOK_APPOINTMENTS: 'book_appointments',
  UPLOAD_REPORTS: 'upload_reports',
  
  // Receptionist permissions
  MANAGE_ALL_APPOINTMENTS: 'manage_all_appointments',
  VIEW_BASIC_PATIENT_INFO: 'view_basic_patient_info',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ALL_ANALYTICS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_PATIENT_RECORDS, // Admins might have view access
  ],
  [ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_PATIENT_RECORDS,
    PERMISSIONS.WRITE_PRESCRIPTIONS,
    PERMISSIONS.WRITE_NOTES,
    PERMISSIONS.REVIEW_REPORTS,
    PERMISSIONS.MANAGE_OWN_APPOINTMENTS,
  ],
  [ROLES.PATIENT]: [
    PERMISSIONS.VIEW_OWN_RECORDS,
    PERMISSIONS.BOOK_APPOINTMENTS,
    PERMISSIONS.UPLOAD_REPORTS,
  ],
  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.MANAGE_ALL_APPOINTMENTS,
    PERMISSIONS.VIEW_BASIC_PATIENT_INFO,
  ]
};

export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};
