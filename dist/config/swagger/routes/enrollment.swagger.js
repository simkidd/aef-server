"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentSwaggerPaths = void 0;
exports.enrollmentSwaggerPaths = {
    '/enrollments/my-training': {
        get: {
            tags: ['Enrollment Queue'],
            summary: 'Get Current Beneficiary Active Training & History',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'Active training and enrollment history' } },
        },
    },
    '/enrollments/queue': {
        get: {
            tags: ['Enrollment Queue'],
            summary: 'Get Physical Verification & Biometric Enrollment Queue (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'programId', in: 'query', schema: { type: 'string' } },
                { name: 'cohortId', in: 'query', schema: { type: 'string' } },
                { name: 'status', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: { 200: { description: 'Paginated enrollment queue' } },
        },
    },
    '/enrollments/{id}/verify-physical': {
        post: {
            tags: ['Enrollment Queue'],
            summary: 'Step 1: Physical Verification of Documents',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                documentsChecked: { type: 'boolean', example: true },
                                identityVerified: { type: 'boolean', example: true },
                                physicalNotes: { type: 'string' },
                                hasIssue: { type: 'boolean', example: false },
                            },
                        },
                    },
                },
            },
            responses: { 200: { description: 'Physical verification updated' } },
        },
    },
    '/enrollments/{id}/register-biometric': {
        post: {
            tags: ['Enrollment Queue'],
            summary: 'Step 2: Register Fingerprint Biometrics & Confirm Trainee Active',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                deviceId: { type: 'string' },
                                rawSample: { type: 'string' },
                            },
                        },
                    },
                },
            },
            responses: { 200: { description: 'Biometrics recorded and trainee enrolled as Active' } },
        },
    },
    '/enrollments/{id}/drop': {
        post: {
            tags: ['Enrollment Queue'],
            summary: 'Drop Inactive Trainee (Frees up cohort slot)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['reason'],
                            properties: { reason: { type: 'string' } },
                        },
                    },
                },
            },
            responses: { 200: { description: 'Trainee status updated to Dropped' } },
        },
    },
    '/enrollments/{id}/withdraw': {
        post: {
            tags: ['Enrollment Queue'],
            summary: 'Voluntary Trainee Withdrawal',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Trainee withdrawn' } },
        },
    },
};
//# sourceMappingURL=enrollment.swagger.js.map