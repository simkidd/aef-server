"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSwaggerPaths = void 0;
exports.staffSwaggerPaths = {
    '/staff': {
        get: {
            tags: ['Organization & Staff'],
            summary: 'List Staff Members (Paginated)',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'category', in: 'query', schema: { type: 'string' } },
                { name: 'departmentId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'status', in: 'query', schema: { type: 'string' } },
                { name: 'search', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            ],
            responses: {
                200: { description: 'Paginated list of staff members' },
            },
        },
        post: {
            tags: ['Organization & Staff'],
            summary: 'Register New Staff Member',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['firstName', 'lastName', 'email', 'phone', 'position', 'departmentId'],
                            properties: {
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                phone: { type: 'string' },
                                position: { type: 'string' },
                                departmentId: { type: 'string' },
                                assignedCentreId: { type: 'string' },
                                category: { type: 'string', enum: ['Core Management', 'Technical Instructor', 'Support Staff', 'Operations'] },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: 'Staff record created' },
            },
        },
    },
    '/staff/{id}': {
        put: {
            tags: ['Organization & Staff'],
            summary: 'Update Staff Record',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
                200: { description: 'Staff record updated' },
                404: { description: 'Staff record not found' },
            },
        },
    },
    '/staff/{staffId}/provision-account': {
        post: {
            tags: ['Organization & Staff'],
            summary: 'Provision Portal Login Account for Staff',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'staffId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                password: { type: 'string' },
                                roles: { type: 'array', items: { type: 'string' } },
                                scopeAssignments: { type: 'array', items: { type: 'object' } },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: 'System account provisioned' },
            },
        },
    },
    '/staff/volunteers/all': {
        get: {
            tags: ['Organization & Staff'],
            summary: 'List Volunteers',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'List of volunteers' } },
        },
    },
    '/staff/volunteers': {
        post: {
            tags: ['Organization & Staff'],
            summary: 'Register Volunteer',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Volunteer registered' } },
        },
    },
    '/staff/partners/all': {
        get: {
            tags: ['Organization & Staff'],
            summary: 'List Partners & Sponsors',
            security: [{ BearerAuth: [] }],
            responses: { 200: { description: 'List of partners' } },
        },
    },
    '/staff/partners': {
        post: {
            tags: ['Organization & Staff'],
            summary: 'Create Partner Record',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Partner created' } },
        },
    },
};
//# sourceMappingURL=staff.swagger.js.map