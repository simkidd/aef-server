export const programSwaggerPaths = {
  '/programs/skills/all': {
    get: {
      tags: ['Programs & Skills'],
      summary: 'List All Active Skill Areas (Public)',
      responses: { 200: { description: 'Active skill areas' } },
    },
  },
  '/programs/skills': {
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
  '/programs/published': {
    get: {
      tags: ['Programs & Skills'],
      summary: 'List Published Programs (Portal / Public Discovery)',
      parameters: [
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'category', in: 'query', schema: { type: 'string' } },
        { name: 'organizerType', in: 'query', schema: { type: 'string' } },
        { name: 'skillAreaId', in: 'query', schema: { type: 'string' } },
      ],
      responses: { 200: { description: 'List of published programs' } },
    },
  },
  '/programs/published/{id}': {
    get: {
      tags: ['Programs & Skills'],
      summary: 'Get Single Published Program Details with Cohorts',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Program details and active cohort centers' } },
    },
  },
  '/programs/featured': {
    get: {
      tags: ['Programs & Skills'],
      summary: 'List Featured Programs (Public Landing)',
      responses: { 200: { description: 'Featured programs list' } },
    },
  },
  '/programs/stats': {
    get: {
      tags: ['Programs & Skills'],
      summary: 'Get Aggregate Program Statistics (Admin)',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Aggregate metrics by status and organization' } },
    },
  },
  '/programs': {
    get: {
      tags: ['Programs & Skills'],
      summary: 'List All Empowerment Programs (Admin)',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string' } },
        { name: 'published', in: 'query', schema: { type: 'boolean' } },
        { name: 'organizerType', in: 'query', schema: { type: 'string' } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'limit', in: 'query', schema: { type: 'integer' } },
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
      summary: 'Get Program Details by ID',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Program detail with cohorts' } },
    },
    put: {
      tags: ['Programs & Skills'],
      summary: 'Update Program',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Program updated' } },
    },
    delete: {
      tags: ['Programs & Skills'],
      summary: 'Delete Program',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Program deleted' } },
    },
  },
};
