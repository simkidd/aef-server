export const assessmentSwaggerPaths = {
  '/assessments': {
    get: {
      tags: ['Assessments'],
      summary: 'List Practical Assessments',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Assessments list' } },
    },
    post: {
      tags: ['Assessments'],
      summary: 'Schedule Practical Competency Assessment',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Assessment scheduled' } },
    },
  },
  '/assessments/results/all': {
    get: {
      tags: ['Assessments'],
      summary: 'Get Assessment Results & Gradebook',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Assessment scores' } },
    },
  },
  '/assessments/results/batch': {
    post: {
      tags: ['Assessments'],
      summary: 'Batch Gradebook Entry (Enter grades for multiple trainees)',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['assessmentId', 'results'],
              properties: {
                assessmentId: { type: 'string' },
                results: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['beneficiaryId', 'score'],
                    properties: {
                      beneficiaryId: { type: 'string' },
                      enrollmentId: { type: 'string' },
                      score: { type: 'number' },
                      remarks: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: { 200: { description: 'Grades recorded and audit trail logged' } },
    },
  },
};
