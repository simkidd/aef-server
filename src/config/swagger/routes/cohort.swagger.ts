export const cohortSwaggerPaths = {
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
  '/cohorts/sessions/all': {
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
  '/cohorts/sessions/{id}/cancel': {
    put: {
      tags: ['Cohorts & Schedule'],
      summary: 'Cancel Timetable Session (No penalty on trainee attendance rate)',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Session cancelled' } },
    },
  },
  '/cohorts/calendar/all': {
    get: {
      tags: ['Cohorts & Schedule'],
      summary: 'List Calendar Exceptions (Holidays, Closures)',
      responses: { 200: { description: 'Calendar events' } },
    },
  },
  '/cohorts/calendar': {
    post: {
      tags: ['Cohorts & Schedule'],
      summary: 'Create Calendar Holiday / Exception',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Event recorded' } },
    },
  },
};
