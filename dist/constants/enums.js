"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleType = exports.CalendarEventType = exports.BiometricScanType = exports.AttendanceStatus = exports.EnrollmentStatus = exports.ApplicationStatus = void 0;
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["DRAFT"] = "Draft";
    ApplicationStatus["SUBMITTED"] = "Submitted";
    ApplicationStatus["UNDER_REVIEW"] = "Under Review";
    ApplicationStatus["SHORTLISTED"] = "Shortlisted";
    ApplicationStatus["SELECTED"] = "Selected";
    ApplicationStatus["PENDING_VERIFICATION"] = "Pending Verification";
    ApplicationStatus["BIOMETRIC_REGISTRATION"] = "Biometric Registration";
    ApplicationStatus["ENROLLMENT_CONFIRMED"] = "Enrollment Confirmed";
    ApplicationStatus["ASSIGNED_TO_COHORT"] = "Assigned to Cohort";
    ApplicationStatus["REJECTED"] = "Rejected";
    ApplicationStatus["NOT_SELECTED"] = "Not Selected";
    ApplicationStatus["WITHDRAWN"] = "Withdrawn";
    ApplicationStatus["EXPIRED"] = "Expired";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["SELECTED"] = "Selected";
    EnrollmentStatus["AWAITING_VERIFICATION"] = "Awaiting Verification";
    EnrollmentStatus["VERIFICATION_ISSUE"] = "Verification Issue";
    EnrollmentStatus["AWAITING_BIOMETRIC"] = "Awaiting Biometric";
    EnrollmentStatus["BIOMETRIC_REGISTERED"] = "Biometric Registered";
    EnrollmentStatus["ACTIVE"] = "Active";
    EnrollmentStatus["COMPLETED"] = "Completed";
    EnrollmentStatus["FAILED"] = "Failed";
    EnrollmentStatus["DROPPED"] = "Dropped";
    EnrollmentStatus["WITHDRAWN"] = "Withdrawn";
    EnrollmentStatus["SUSPENDED"] = "Suspended";
    EnrollmentStatus["TRANSFERRED"] = "Transferred";
    EnrollmentStatus["DID_NOT_COMPLETE_ENROLLMENT"] = "Did Not Complete Enrollment";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "Present";
    AttendanceStatus["LATE"] = "Late";
    AttendanceStatus["ABSENT"] = "Absent";
    AttendanceStatus["EXCUSED"] = "Excused";
    AttendanceStatus["PARTIAL"] = "Partial";
    AttendanceStatus["INCOMPLETE"] = "Incomplete";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var BiometricScanType;
(function (BiometricScanType) {
    BiometricScanType["IN"] = "IN";
    BiometricScanType["OUT"] = "OUT";
})(BiometricScanType || (exports.BiometricScanType = BiometricScanType = {}));
var CalendarEventType;
(function (CalendarEventType) {
    CalendarEventType["PUBLIC_HOLIDAY"] = "Public Holiday";
    CalendarEventType["CENTRE_CLOSED"] = "Centre Closed";
    CalendarEventType["TRAINER_UNAVAILABLE"] = "Trainer Unavailable";
    CalendarEventType["EMERGENCY_CLOSURE"] = "Emergency Closure";
    CalendarEventType["WEATHER_CANCELLATION"] = "Weather-related cancellation";
    CalendarEventType["PROGRAM_BREAK"] = "Program Break";
    CalendarEventType["EXAM_DAY"] = "Examination Day";
    CalendarEventType["ASSESSMENT_DAY"] = "Assessment Day";
    CalendarEventType["RESCHEDULED_TRAINING"] = "Rescheduled Training";
    CalendarEventType["OTHER"] = "Other";
})(CalendarEventType || (exports.CalendarEventType = CalendarEventType = {}));
var UserRoleType;
(function (UserRoleType) {
    UserRoleType["SUPER_ADMIN"] = "Super Administrator";
    UserRoleType["CENTRE_MANAGER"] = "Centre Manager";
    UserRoleType["PROGRAM_MANAGER"] = "Program Manager";
    UserRoleType["TRAINER"] = "Trainer / Instructor";
    UserRoleType["HR_OFFICER"] = "HR Officer";
    UserRoleType["FINANCE_OFFICER"] = "Finance Officer";
    UserRoleType["REGISTRATION_OFFICER"] = "Biometric & Registration Officer";
    UserRoleType["BENEFICIARY"] = "Beneficiary";
})(UserRoleType || (exports.UserRoleType = UserRoleType = {}));
//# sourceMappingURL=enums.js.map