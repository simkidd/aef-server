"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateSwaggerPaths = void 0;
exports.certificateSwaggerPaths = {
    '/certificates': {
        get: {
            tags: ['Certificates'],
            summary: 'List Issued Certificates (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'programId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'cohortId', in: 'query', schema: { type: 'string' } },
                { name: 'beneficiaryId', in: 'query', schema: { type: 'string' } },
                { name: 'status', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: { 200: { description: 'Paginated certificates' } },
        },
    },
    '/certificates/issue': {
        post: {
            tags: ['Certificates'],
            summary: 'Issue Graduation Certificate',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['enrollmentId', 'signatoryName', 'signatoryTitle'],
                            properties: {
                                enrollmentId: { type: 'string' },
                                signatoryName: { type: 'string' },
                                signatoryTitle: { type: 'string' },
                                grade: { type: 'string' },
                                score: { type: 'number' },
                            },
                        },
                    },
                },
            },
            responses: { 201: { description: 'Certificate generated and QR verification hash created' } },
        },
    },
    '/certificates/verify/{code}': {
        get: {
            tags: ['Certificates'],
            summary: 'Public Cryptographic Certificate Verification (QR Scanner)',
            description: 'Public endpoint accessible without authentication to verify authentic AEF certificates.',
            parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
                200: { description: 'Authentic certificate verified' },
                404: { description: 'Certificate not found or hash invalid' },
            },
        },
    },
};
//# sourceMappingURL=certificate.swagger.js.map