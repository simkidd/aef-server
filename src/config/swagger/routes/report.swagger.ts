export const reportSwaggerPaths = {
  '/reports/overview': {
    get: {
      tags: ['Reports & Analytics'],
      summary: 'Executive Operations Dashboard Overview',
      description: 'Real-time counters for active programs, cohorts, trainees, online biometric devices, today sessions, and live attendance rate.',
      responses: { 200: { description: 'Live operational KPIs' } },
    },
  },
  '/reports/impact': {
    get: {
      tags: ['Reports & Analytics'],
      summary: 'Demographic & Skill Impact Analytics',
      description: 'Gender balance, educational qualifications, program popularity, and centre capacity utilization metrics.',
      responses: { 200: { description: 'Impact analytics' } },
    },
  },
};
