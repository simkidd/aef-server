export declare enum ApplicationStatus {
    DRAFT = "Draft",
    SUBMITTED = "Submitted",
    UNDER_REVIEW = "Under Review",
    SHORTLISTED = "Shortlisted",
    SELECTED = "Selected",
    PENDING_VERIFICATION = "Pending Verification",
    BIOMETRIC_REGISTRATION = "Biometric Registration",
    ENROLLMENT_CONFIRMED = "Enrollment Confirmed",
    ASSIGNED_TO_COHORT = "Assigned to Cohort",
    REJECTED = "Rejected",
    NOT_SELECTED = "Not Selected",
    WITHDRAWN = "Withdrawn",
    EXPIRED = "Expired"
}
export declare enum EnrollmentStatus {
    SELECTED = "Selected",
    AWAITING_VERIFICATION = "Awaiting Verification",
    VERIFICATION_ISSUE = "Verification Issue",
    AWAITING_BIOMETRIC = "Awaiting Biometric",
    BIOMETRIC_REGISTERED = "Biometric Registered",
    ACTIVE = "Active",
    COMPLETED = "Completed",
    FAILED = "Failed",
    DROPPED = "Dropped",
    WITHDRAWN = "Withdrawn",
    SUSPENDED = "Suspended",
    TRANSFERRED = "Transferred",
    DID_NOT_COMPLETE_ENROLLMENT = "Did Not Complete Enrollment"
}
export declare enum AttendanceStatus {
    PRESENT = "Present",
    LATE = "Late",
    ABSENT = "Absent",
    EXCUSED = "Excused",
    PARTIAL = "Partial",
    INCOMPLETE = "Incomplete"
}
export declare enum BiometricScanType {
    IN = "IN",
    OUT = "OUT"
}
export declare enum CalendarEventType {
    PUBLIC_HOLIDAY = "Public Holiday",
    CENTRE_CLOSED = "Centre Closed",
    TRAINER_UNAVAILABLE = "Trainer Unavailable",
    EMERGENCY_CLOSURE = "Emergency Closure",
    WEATHER_CANCELLATION = "Weather-related cancellation",
    PROGRAM_BREAK = "Program Break",
    EXAM_DAY = "Examination Day",
    ASSESSMENT_DAY = "Assessment Day",
    RESCHEDULED_TRAINING = "Rescheduled Training",
    OTHER = "Other"
}
export declare enum UserRoleType {
    SUPER_ADMIN = "Super Administrator",
    CENTRE_MANAGER = "Centre Manager",
    PROGRAM_MANAGER = "Program Manager",
    TRAINER = "Trainer / Instructor",
    HR_OFFICER = "HR Officer",
    FINANCE_OFFICER = "Finance Officer",
    REGISTRATION_OFFICER = "Biometric & Registration Officer",
    BENEFICIARY = "Beneficiary"
}
