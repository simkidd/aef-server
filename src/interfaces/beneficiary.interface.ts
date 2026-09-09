import { ApplicationStatus, EnrollmentStatus } from '../constants/enums.js';

export interface IBeneficiaryProfile {
  _id: any;
  userId: any;
  beneficiaryCode: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: Date;
  phone: string;
  alternatePhone?: string;
  email: string;
  address?: string;
  stateOfOrigin?: string;
  lgaOfOrigin?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  highestEducation?: 'None' | 'Primary' | 'Secondary (SSCE/WAEC)' | 'OND/NCE' | 'HND/BSc' | 'Postgraduate' | 'Vocational Certificate';
  employmentStatus?: 'Unemployed' | 'Self-Employed' | 'Student' | 'Employed Part-Time' | 'Employed Full-Time';
  disabilityStatus?: 'None' | 'Visual' | 'Hearing' | 'Mobility' | 'Other';
  identificationType?: 'National NIN' | "Voter's Card" | "Driver's License" | 'International Passport' | 'Birth Certificate';
  identificationNumber?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    address?: string;
  };
  profilePhotoUrl?: string;
  documents?: {
    name: string;
    type: string;
    url: string;
    verified: boolean;
    uploadedAt: Date;
  }[];
  biometricRegistered: boolean;
  biometricIdentifier?: string; // Fingerprint / Face template token identifier
  activeEnrollmentId?: any; // Currently active primary training enrollment
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication {
  _id: any;
  applicationNumber: string;
  beneficiaryId: any; // BeneficiaryProfile ID
  programId: any;
  preferredSkillAreaId: any;
  preferredCentreId?: any;
  status: ApplicationStatus;
  statusReason?: string;
  reviewedBy?: any; // Staff ID
  reviewedAt?: Date;
  statementOfPurpose?: string;
  previousExperience?: string;
  submittedAt: Date;
  statusHistory: {
    status: ApplicationStatus;
    changedBy: any;
    changedAt: Date;
    reason?: string;
  }[];
}

export interface IEnrollment {
  _id: any;
  enrollmentCode: string;
  beneficiaryId: any; // BeneficiaryProfile ID
  applicationId: any;
  programId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  status: EnrollmentStatus;
  statusReason?: string;
  verificationDetails?: {
    verifiedByStaffId?: any;
    verifiedAt?: Date;
    documentsChecked?: boolean;
    identityVerified?: boolean;
    physicalNotes?: string;
  };
  biometricRegistrationDetails?: {
    registeredByStaffId?: any;
    registeredAt?: Date;
    deviceId?: any;
    biometricIdentifier?: string;
  };
  enrollmentDate?: Date;
  completionDate?: Date;
  droppedDate?: Date;
  dropReason?: string;
  replacedByEnrollmentId?: any;
  overallAttendanceRate?: number; // e.g. 92.5 (%)
  assessmentPassed?: boolean;
  certificateIssued?: boolean;
  certificateId?: any;
  statusHistory: {
    status: EnrollmentStatus;
    changedBy: any;
    changedAt: Date;
    reason?: string;
  }[];
}
