export interface IAssessment {
    _id: any;
    title: string;
    programId: any;
    cohortId: any;
    skillAreaId: any;
    type: 'Continuous Assessment' | 'Mid-Term Practical' | 'Final Practical' | 'Theory Exam' | 'Project Work';
    maxScore: number;
    passingScore: number;
    weightagePercent: number;
    scheduledDate: Date;
    examinerStaffId?: any;
    instructions?: string;
    isPublished: boolean;
    createdAt: Date;
}
export interface IAssessmentResult {
    _id: any;
    assessmentId: any;
    beneficiaryId: any;
    enrollmentId: any;
    cohortId: any;
    score: number;
    percentage: number;
    passed: boolean;
    grade?: 'Distinction' | 'Credit' | 'Pass' | 'Fail';
    examinerStaffId: any;
    remarks?: string;
    attemptNumber: number;
    gradedAt: Date;
}
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
