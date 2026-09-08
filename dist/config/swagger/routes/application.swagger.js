"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSwaggerPaths = void 0;
exports.applicationSwaggerPaths = {
    '/applications': {
        get: {
            tags: ['Applications'],
            summary: 'List Beneficiary Applications (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'programId', in: 'query', schema: { type: 'string' } },
                { name: 'skillAreaId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'status', in: 'query', schema: { type: 'string' } },
                { name: 'search', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: { 200: { description: 'Paginated applications list' } },
        },
    },
    '/applications/apply': {
        post: {
            tags: ['Applications'],
            summary: 'Submit Beneficiary Application (Portal)',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['programId', 'preferredSkillAreaId', 'preferredCentreId'],
                            properties: {
                                programId: { type: 'string' },
                                preferredSkillAreaId: { type: 'string' },
                                preferredCentreId: { type: 'string' },
                                statementOfPurpose: { type: 'string' },
                                previousExperience: { type: 'string' },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: 'Application submitted' },
                409: { description: 'Active application already exists' },
            },
        },
    },
    '/applications/my': {
        get: {
            tags: ['Applications'],
            summary: 'List Current Beneficiary Applications (Portal)',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'My applications' } },
        },
    },
    '/applications/{id}/status': {
        put: {
            tags: ['Applications'],
            summary: 'Update Application Status (Screening / Selection)',
            description: 'Transitions application status. When set to SELECTED, auto-provisions entry in Enrollment Queue.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['status'],
                            properties: {
                                status: { type: 'string', enum: ['Under Review', 'Shortlisted', 'Selected', 'Waitlisted', 'Rejected'] },
                                reason: { type: 'string' },
                                assignedCohortId: { type: 'string' },
                            },
                        },
                    },
                },
            },
            responses: { 200: { description: 'Status updated and notification dispatched' } },
        },
    },
};
//# sourceMappingURL=application.swagger.js.map