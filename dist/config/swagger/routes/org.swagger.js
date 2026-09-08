"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgSwaggerPaths = void 0;
exports.orgSwaggerPaths = {
    '/org': {
        get: {
            tags: ['Organization & Staff'],
            summary: 'Get Foundation Information',
            responses: { 200: { description: 'Organization metadata' } },
        },
        put: {
            tags: ['Organization & Staff'],
            summary: 'Update Organization Information',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'Organization updated' } },
        },
    },
    '/org/departments/all': {
        get: {
            tags: ['Organization & Staff'],
            summary: 'List Departments',
            responses: { 200: { description: 'Departments list' } },
        },
    },
    '/org/departments': {
        post: {
            tags: ['Organization & Staff'],
            summary: 'Create Department',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Department created' } },
        },
    },
    '/org/departments/{id}': {
        put: {
            tags: ['Organization & Staff'],
            summary: 'Update Department',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Department updated' } },
        },
    },
};
//# sourceMappingURL=org.swagger.js.map