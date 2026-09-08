export const centreSwaggerPaths = {
  '/centres': {
    get: {
      tags: ['Training Centres'],
      summary: 'List Training Centres with Room & Device counts',
      responses: { 200: { description: 'List of training centres' } },
    },
    post: {
      tags: ['Training Centres'],
      summary: 'Create Training Centre',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Centre created' } },
    },
  },
  '/centres/{id}': {
    get: {
      tags: ['Training Centres'],
      summary: 'Get Training Centre Details with Facilities & Active Cohorts',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Centre detail' }, 404: { description: 'Centre not found' } },
    },
    put: {
      tags: ['Training Centres'],
      summary: 'Update Training Centre',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Centre updated' } },
    },
  },
  '/centres/facilities/rooms': {
    get: {
      tags: ['Training Centres'],
      summary: 'List Training Rooms and Labs',
      parameters: [{ name: 'centreId', in: 'query', schema: { type: 'string' } }],
      responses: { 200: { description: 'List of rooms' } },
    },
    post: {
      tags: ['Training Centres'],
      summary: 'Add Training Room / Lab',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Room created' } },
    },
  },
  '/centres/assets/all': {
    get: {
      tags: ['Training Centres'],
      summary: 'List Centre Inventory Assets',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'centreId', in: 'query', schema: { type: 'string' } }],
      responses: { 200: { description: 'List of assets' } },
    },
  },
  '/centres/assets': {
    post: {
      tags: ['Training Centres'],
      summary: 'Register Asset',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Asset registered' } },
    },
  },
  '/centres/documents/all': {
    get: {
      tags: ['Training Centres'],
      summary: 'List Compliance & Centre Documents',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'List of documents' } },
    },
  },
  '/centres/documents': {
    post: {
      tags: ['Training Centres'],
      summary: 'Upload Document Record',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Document uploaded' } },
    },
  },
};
