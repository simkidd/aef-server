export interface ICertificate {
  _id: any;
  certificateNumber: string; // e.g. AEF-2026-SOL-00412
  verificationCode: string; // URL verification hash
  beneficiaryId: any;
  enrollmentId: any;
  programId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  issueDate: Date;
  overallAttendanceRate: number;
  overallAssessmentScore?: number;
  grade?: string;
  authorizedSignatory: {
    name: string;
    title: string;
    signatureUrl?: string;
  };
  issuingOrganization: string;
  qrCodeUrl?: string;
  status: 'Issued' | 'Revoked' | 'Suspended';
  revocationReason?: string;
  createdAt: Date;
}
