import { RawBiometricPayload } from "./biometric.adapter.js";
export declare class BiometricService {
    /**
     * Register a new biometric identity for a selected trainee
     */
    static registerTraineeBiometrics(params: {
        beneficiaryId: string;
        centreId: string;
        deviceId: string;
        staffId: string;
        rawSample?: any;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../models/biometric.model.js").IBiometricIdentityDocument, {}, {}> & import("../../interfaces/biometric.interface.js").IBiometricIdentity & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    /**
     * Ingest raw biometric scan event from physical hardware, kiosk, or test simulator
     */
    static processRawScanEvent(payload: RawBiometricPayload): Promise<{
        event: import("mongoose").Document<unknown, {}, import("../../models/biometric.model.js").IBiometricEventDocument, {}, {}> & import("../../interfaces/biometric.interface.js").IBiometricEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        isMatched: boolean;
        beneficiaryId: string | undefined;
        beneficiary: any;
        enrollment: any;
        skillArea: any;
        cohort: any;
        attendanceRecord: any;
    }>;
}
