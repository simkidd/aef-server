export interface ICertificate {
    _id: any;
    certificateNumber: string;
    verificationCode: string;
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
