"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSwaggerPaths = void 0;
exports.adminSwaggerPaths = {
    '/admin/users': {
        get: {
            tags: ['Administration'],
            summary: 'List User Accounts (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'role', in: 'query', schema: { type: 'string' } },
                { name: 'isStaff', in: 'query', schema: { type: 'boolean' } },
                { name: 'search', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: { 200: { description: 'Paginated user accounts' } },
        },
    },
    '/admin/users/{id}/roles-scopes': {
        put: {
            tags: ['Administration'],
            summary: 'Update User Roles, Custom Permissions & Scopes',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                roles: { type: 'array', items: { type: 'string' } },
                                customPermissions: { type: 'array', items: { type: 'string' } },
                                scopeAssignments: { type: 'array', items: { type: 'object' } },
                                isActive: { type: 'boolean' },
                            },
                        },
                    },
                },
            },
            responses: { 200: { description: 'User roles and scopes updated' } },
        },
    },
    '/admin/roles': {
        get: {
            tags: ['Administration'],
            summary: 'List Roles & Permissions Matrix',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'Roles and all system permissions' } },
        },
    },
    '/admin/roles/{id}': {
        put: {
            tags: ['Administration'],
            summary: 'Update Role Permissions',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Role permissions saved' } },
        },
    },
    '/admin/audit-logs': {
        get: {
            tags: ['Administration'],
            summary: 'Query Comprehensive Audit Trail (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'action', in: 'query', schema: { type: 'string' } },
                { name: 'entityType', in: 'query', schema: { type: 'string' } },
                { name: 'userId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
                { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: { 200: { description: 'Paginated audit logs' } },
        },
    },
    '/admin/settings': {
        get: {
            tags: ['Administration'],
            summary: 'List System Settings',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'Settings' } },
        },
        post: {
            tags: ['Administration'],
            summary: 'Update System Setting',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['key', 'value'],
                            properties: {
                                key: { type: 'string' },
                                value: { type: 'string' },
                                description: { type: 'string' },
                                category: { type: 'string' },
                            },
                        },
                    },
                },
            },
            responses: { 200: { description: 'Setting saved' } },
        },
    },
};
//# sourceMappingURL=admin.swagger.js.map