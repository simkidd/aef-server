"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cohortSwaggerPaths = void 0;
exports.cohortSwaggerPaths = {
    '/cohorts': {
        get: {
            tags: ['Cohorts & Schedule'],
            summary: 'List Cohorts with Dynamic Capacity Metrics',
            parameters: [
                { name: 'programId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'status', in: 'query', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'List of cohorts with active, selected, available slot metrics' } },
        },
        post: {
            tags: ['Cohorts & Schedule'],
            summary: 'Create Training Cohort & Auto-generate Sessions Timetable',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Cohort and scheduled timetable sessions created' } },
        },
    },
    '/cohorts/{id}': {
        get: {
            tags: ['Cohorts & Schedule'],
            summary: 'Get Cohort Details & Enrolled Trainees',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Cohort details' }, 404: { description: 'Cohort not found' } },
        },
        put: {
            tags: ['Cohorts & Schedule'],
            summary: 'Update Cohort',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Cohort updated' } },
        },
    },
    '/cohorts/{id}/timetable/draft': {
        post: {
            tags: ['Cohorts & Schedule'],
            summary: 'Save Timetable Multi-Slot Draft',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Timetable draft saved' } },
        },
    },
    '/cohorts/{id}/timetable/publish': {
        post: {
            tags: ['Cohorts & Schedule'],
            summary: 'Publish Cohort Timetable',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Timetable published' } },
        },
    },
    '/cohorts/{id}/timetable/unpublish': {
        post: {
            tags: ['Cohorts & Schedule'],
            summary: 'Unpublish Cohort Timetable',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Timetable reverted to draft' } },
        },
    },
    '/cohorts/timetable': {
        get: {
            tags: ['Cohorts & Schedule'],
            summary: 'List Timetable Training Sessions',
            parameters: [
                { name: 'cohortId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'skillAreaId', in: 'query', schema: { type: 'string' } },
                { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
                { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
            ],
            responses: { 200: { description: 'Scheduled practical sessions' } },
        },
    },
    '/cohorts/schedule/sessions': {
        get: {
            tags: ['Cohorts & Schedule'],
            summary: 'List Scheduled Sessions (Alias)',
            parameters: [
                { name: 'cohortId', in: 'query', schema: { type: 'string' } },
                { name: 'centreId', in: 'query', schema: { type: 'string' } },
                { name: 'skillAreaId', in: 'query', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'Scheduled practical sessions' } },
        },
    },
    '/cohorts/schedule/sessions/{id}/cancel': {
        post: {
            tags: ['Cohorts & Schedule'],
            summary: 'Cancel Timetable Session (No penalty on trainee attendance rate)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Session cancelled' } },
        },
    },
    '/cohorts/calendar/events': {
        get: {
            tags: ['Cohorts & Schedule'],
            summary: 'List Calendar Exceptions & Holidays',
            responses: { 200: { description: 'Calendar events' } },
        },
        post: {
            tags: ['Cohorts & Schedule'],
            summary: 'Create Calendar Holiday / Exception',
            security: [{ BearerAuth: [] }],
            responses: { 201: { description: 'Event recorded' } },
        },
    },
};
//# sourceMappingURL=cohort.swagger.js.map