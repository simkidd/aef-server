import { BiometricScanType } from '../../constants/enums.js';
export interface RawBiometricPayload {
    deviceSerial: string;
    biometricToken: string;
    scanType: BiometricScanType;
    timestamp: string | Date;
    quality?: number;
    metadata?: Record<string, any>;
}
export interface BiometricDriver {
    name: string;
    registerTemplate(beneficiaryId: string, rawSample: any): Promise<{
        token: string;
        quality: number;
    }>;
    verifySample(rawSample: any, templateToken: string): Promise<boolean>;
    syncDevice(deviceSerial: string): Promise<{
        success: boolean;
        templatesSynced: number;
    }>;
}
export declare class MockBiometricDriver implements BiometricDriver {
    name: string;
    registerTemplate(beneficiaryId: string, rawSample?: any): Promise<{
        token: string;
        quality: number;
    }>;
    verifySample(rawSample: any, templateToken: string): Promise<boolean>;
    syncDevice(deviceSerial: string): Promise<{
        success: boolean;
        templatesSynced: number;
    }>;
}
export declare class BiometricAdapterFactory {
    private static driver;
    static getDriver(): BiometricDriver;
    static setDriver(driver: BiometricDriver): void;
}
