"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programSwaggerPaths = void 0;
exports.programSwaggerPaths = {
    '/programs/skills': {
        get: {
            tags: ['Programs & Skills'],
            summary: 'List Skill Areas',
            responses: { 200: { description: 'Active skill areas' } },
        },
        post: {
            tags: ['Programs & Skills'],
            summary: 'Create Skill Area',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Skill area created' } },
        },
    },
    '/programs/skills/{id}': {
        put: {
            tags: ['Programs & Skills'],
            summary: 'Update Skill Area',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Skill area updated' } },
        },
    },
    '/programs': {
        get: {
            tags: ['Programs & Skills'],
            summary: 'List Empowerment Programs',
            parameters: [
                { name: 'status', in: 'query', schema: { type: 'string' } },
                { name: 'published', in: 'query', schema: { type: 'boolean' } },
                { name: 'search', in: 'query', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'List of programs' } },
        },
        post: {
            tags: ['Programs & Skills'],
            summary: 'Create Program',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Program created' } },
        },
    },
    '/programs/{id}': {
        get: {
            tags: ['Programs & Skills'],
            summary: 'Get Program Details & Active Cohorts',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Program detail' } },
        },
        put: {
            tags: ['Programs & Skills'],
            summary: 'Update Program',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Program updated' } },
        },
    },
};
//# sourceMappingURL=program.swagger.js.map