"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricAdapterFactory = exports.MockBiometricDriver = void 0;
class MockBiometricDriver {
    name = 'MockBiometricDriver (AEF Simulator)';
    async registerTemplate(beneficiaryId, rawSample) {
        // Generates a deterministic token based on beneficiaryId or timestamp
        const token = `BIO-AEF-${beneficiaryId.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        return {
            token,
            quality: rawSample?.quality || 98,
        };
    }
    async verifySample(rawSample, templateToken) {
        return true;
    }
    async syncDevice(deviceSerial) {
        return {
            success: true,
            templatesSynced: 120,
        };
    }
}
exports.MockBiometricDriver = MockBiometricDriver;
class BiometricAdapterFactory {
    static driver = new MockBiometricDriver();
    static getDriver() {
        return this.driver;
    }
    static setDriver(driver) {
        this.driver = driver;
    }
}
exports.BiometricAdapterFactory = BiometricAdapterFactory;
//# sourceMappingURL=biometric.adapter.js.map