import { BiometricScanType } from '../constants/enums.js';
export interface IBiometricDevice {
    _id: any;
    deviceName: string;
    deviceSerial: string;
    centreId: any;
    locationDescription: string;
    model: string;
    deviceType: 'Fingerprint';
    ipAddress?: string;
    status: 'Online' | 'Offline' | 'Syncing' | 'Maintenance';
    lastHeartbeat?: Date;
    lastSyncAt?: Date;
    registeredTemplatesCount: number;
    apiKey?: string;
    isActive: boolean;
}
export interface IBiometricIdentity {
    _id: any;
    beneficiaryId: any;
    centreId: any;
    biometricToken: string;
    registeredDeviceId: any;
    registeredByStaffId: any;
    registeredAt: Date;
    qualityScore?: number;
    isActive: boolean;
}
export interface IBiometricEvent {
    _id: any;
    deviceSerial: string;
    centreId: any;
    biometricToken: string;
    scanType: BiometricScanType;
    timestamp: Date;
    isMatched: boolean;
    beneficiaryId?: any;
    isProcessed: boolean;
    processingError?: string;
    rawPayload?: Record<string, any>;
    createdAt: Date;
}
