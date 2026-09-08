export declare class CertificateService {
    /**
     * Generate verifiable Certificate for an eligible completed trainee
     */
    static issueCertificate(params: {
        enrollmentId: string;
        signatoryName?: string;
        signatoryTitle?: string;
        grade?: string;
        score?: number;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../models/certificate.model.js").ICertificateDocument, {}, {}> & import("../../models/certificate.model.js").ICertificateDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Verify a certificate by its public verification hash
     */
    static verifyPublicCertificate(verificationCode: string): Promise<(import("mongoose").FlattenMaps<import("../../models/certificate.model.js").ICertificateDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
