export const announcementSwaggerPaths = {
  '/announcements': {
    get: {
      tags: ['Announcements'],
      summary: 'List Announcements Filtered by Scope',
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'centreId', in: 'query', schema: { type: 'string' } },
        { name: 'programId', in: 'query', schema: { type: 'string' } },
        { name: 'cohortId', in: 'query', schema: { type: 'string' } },
      ],
      responses: { 200: { description: 'Active announcements' } },
    },
    post: {
      tags: ['Announcements'],
      summary: 'Publish Announcement',
      security: [{ BearerAuth: [] }],
      responses: { 201: { description: 'Announcement published' } },
    },
  },
  '/announcements/notifications/my': {
    get: {
      tags: ['Announcements'],
      summary: 'Get Current User In-App Notifications Feed',
      security: [{ BearerAuth: [] }],
      responses: { 200: { description: 'Notifications feed with unread count' } },
    },
  },
  '/announcements/notifications/{id}/read': {
    put: {
      tags: ['Announcements'],
      summary: 'Mark Notification as Read',
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Notification marked as read' } },
    },
  },
};
