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
  registerTemplate(beneficiaryId: string, rawSample: any): Promise<{ token: string; quality: number }>;
  verifySample(rawSample: any, templateToken: string): Promise<boolean>;
  syncDevice(deviceSerial: string): Promise<{ success: boolean; templatesSynced: number }>;
}

export class MockBiometricDriver implements BiometricDriver {
  public name = 'MockBiometricDriver (AEF Simulator)';

  public async registerTemplate(beneficiaryId: string, rawSample?: any): Promise<{ token: string; quality: number }> {
    // Generates a deterministic token based on beneficiaryId or timestamp
    const token = `BIO-AEF-${beneficiaryId.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return {
      token,
      quality: rawSample?.quality || 98,
    };
  }

  public async verifySample(rawSample: any, templateToken: string): Promise<boolean> {
    return true;
  }

  public async syncDevice(deviceSerial: string): Promise<{ success: boolean; templatesSynced: number }> {
    return {
      success: true,
      templatesSynced: 120,
    };
  }
}

export class BiometricAdapterFactory {
  private static driver: BiometricDriver = new MockBiometricDriver();

  public static getDriver(): BiometricDriver {
    return this.driver;
  }

  public static setDriver(driver: BiometricDriver): void {
    this.driver = driver;
  }
}
