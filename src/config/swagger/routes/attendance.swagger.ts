export const attendanceSwaggerPaths = {
  '/attendance/today-summary': {
    get: {
      tags: ['Attendance'],
      summary: 'Today Live Attendance Monitoring Across Centres',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'centreId', in: 'query', schema: { type: 'string' } }],
      responses: { 200: { description: 'Live session metrics' } },
    },
  },
  '/attendance/sheet': {
    get: {
      tags: ['Attendance'],
      summary: 'Attendance Sheet Matrix with Filters (Paginated)',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'centreId', in: 'query', schema: { type: 'string' } },
        { name: 'cohortId', in: 'query', schema: { type: 'string' } },
        { name: 'skillAreaId', in: 'query', schema: { type: 'string' } },
        { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
        { name: 'year', in: 'query', schema: { type: 'integer', example: 2026 } },
        { name: 'month', in: 'query', schema: { type: 'integer', example: 9 } },
        { name: 'status', in: 'query', schema: { type: 'string' } },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
      ],
      responses: { 200: { description: 'Paginated attendance sheet' } },
    },
  },
  '/attendance/my-history': {
    get: {
      tags: ['Attendance'],
      summary: 'Beneficiary Personal Attendance History (Portal)',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Personal attendance records and rate' } },
    },
  },
  '/attendance/my': {
    get: {
      tags: ['Attendance'],
      summary: 'Beneficiary Personal Attendance History Alias (Portal)',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Personal attendance records and rate' } },
    },
  },
  '/attendance/corrections/{id}': {
    post: {
      tags: ['Attendance'],
      summary: 'Manual Attendance Correction with Mandatory Audit Log',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['newStatus', 'reason'],
              properties: {
                newStatus: { type: 'string', enum: ['Present', 'Late', 'Excused', 'Absent'] },
                newClockIn: { type: 'string', format: 'date-time' },
                newClockOut: { type: 'string', format: 'date-time' },
                reason: { type: 'string' },
                supportingEvidenceUrl: { type: 'string' },
              },
            },
          },
        },
      },
      responses: { 200: { description: 'Attendance corrected and recalculation triggered' } },
    },
  },
  '/attendance/policies': {
    get: {
      tags: ['Attendance'],
      summary: 'Get Attendance Grading Policies',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Attendance policies' } },
    },
  },
  '/attendance/policies/{id}': {
    put: {
      tags: ['Attendance'],
      summary: 'Update Attendance Policy Thresholds',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Policy saved' } },
    },
  },
};
