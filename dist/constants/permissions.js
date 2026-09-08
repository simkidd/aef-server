"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = exports.SCOPES = void 0;
exports.SCOPES = {
    GLOBAL: 'GLOBAL',
    CENTRE: 'CENTRE',
    PROGRAM: 'PROGRAM',
    DEPARTMENT: 'DEPARTMENT',
};
exports.PERMISSIONS = {
    // Organization & Staff
    ORG_VIEW: 'org:view',
    ORG_MANAGE: 'org:manage',
    STAFF_VIEW: 'staff:view',
    STAFF_MANAGE: 'staff:manage',
    STAFF_SENSITIVE_VIEW: 'staff:sensitive_view',
    VOLUNTEERS_MANAGE: 'volunteers:manage',
    PARTNERS_MANAGE: 'partners:manage',
    CENTRES_MANAGE: 'centres:manage',
    FACILITIES_MANAGE: 'facilities:manage',
    ASSETS_MANAGE: 'assets:manage',
    DOCUMENTS_MANAGE: 'documents:manage',
    // Programs & Cohorts
    PROGRAMS_VIEW: 'programs:view',
    PROGRAMS_MANAGE: 'programs:manage',
    SKILLS_MANAGE: 'skills:manage',
    COHORTS_VIEW: 'cohorts:view',
    COHORTS_MANAGE: 'cohorts:manage',
    TIMETABLE_MANAGE: 'timetable:manage',
    CALENDAR_MANAGE: 'calendar:manage',
    // Beneficiaries & Applications
    APPLICANTS_VIEW: 'applicants:view',
    APPLICANTS_REVIEW: 'applicants:review',
    ENROLLMENT_MANAGE: 'enrollment:manage',
    BENEFICIARIES_VIEW: 'beneficiaries:view',
    BENEFICIARIES_MANAGE: 'beneficiaries:manage',
    // Biometrics & Attendance
    BIOMETRICS_VIEW: 'biometrics:view',
    BIOMETRICS_REGISTER: 'biometrics:register',
    DEVICES_MANAGE: 'devices:manage',
    ATTENDANCE_VIEW: 'attendance:view',
    ATTENDANCE_EDIT: 'attendance:edit',
    ATTENDANCE_POLICY_MANAGE: 'attendance:policy_manage',
    // Assessments & Certificates
    ASSESSMENTS_MANAGE: 'assessments:manage',
    RESULTS_ENTER: 'results:enter',
    CERTIFICATES_ISSUE: 'certificates:issue',
    CERTIFICATES_REVOKE: 'certificates:revoke',
    // Reports, Logs & Administration
    REPORTS_VIEW: 'reports:view',
    REPORTS_EXPORT: 'reports:export',
    USERS_MANAGE: 'users:manage',
    ROLES_MANAGE: 'roles:manage',
    AUDIT_VIEW: 'audit:view',
    SETTINGS_MANAGE: 'settings:manage',
    ANNOUNCEMENTS_MANAGE: 'announcements:manage',
};
//# sourceMappingURL=permissions.js.map