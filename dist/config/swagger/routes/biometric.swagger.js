"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.biometricSwaggerPaths = void 0;
exports.biometricSwaggerPaths = {
    '/biometrics/devices': {
        get: {
            tags: ['Biometrics'],
            summary: 'List Registered Fingerprint Optical Scanners',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'centreId', in: 'query', schema: { type: 'string' } }],
            responses: { 200: { description: 'Biometric devices' } },
        },
        post: {
            tags: ['Biometrics'],
            summary: 'Register Optical Fingerprint Scanner',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Device registered' } },
        },
    },
    '/biometrics/scan': {
        post: {
            tags: ['Biometrics'],
            summary: 'Hardware Ingestion Webhook / Simulation Endpoint',
            description: 'Accepts raw fingerprint token from edge scanner, matches active enrolled trainee, and creates attendance record.',
            security: [{ BiometricGatewayKey: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['deviceSerial', 'biometricToken'],
                            properties: {
                                deviceSerial: { type: 'string', example: 'AEF-FP-LAG-01' },
                                biometricToken: { type: 'string', example: 'fp_sim_fatima_adebayo' },
                                scanType: { type: 'string', enum: ['IN', 'OUT'], default: 'IN' },
                                timestamp: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: 'Scan processed and matched' },
            },
        },
    },
    '/biometrics/events': {
        get: {
            tags: ['Biometrics'],
            summary: 'List Raw Biometric Scan Logs (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'isMatched', in: 'query', schema: { type: 'boolean' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: { 200: { description: 'Paginated scan logs' } },
        },
    },
};
//# sourceMappingURL=biometric.swagger.js.map