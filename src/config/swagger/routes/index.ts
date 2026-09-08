import { authSwaggerPaths } from './auth.swagger.js';
import { staffSwaggerPaths } from './staff.swagger.js';
import { centreSwaggerPaths } from './centre.swagger.js';
import { programSwaggerPaths } from './program.swagger.js';
import { cohortSwaggerPaths } from './cohort.swagger.js';
import { applicationSwaggerPaths } from './application.swagger.js';
import { enrollmentSwaggerPaths } from './enrollment.swagger.js';
import { biometricSwaggerPaths } from './biometric.swagger.js';
import { attendanceSwaggerPaths } from './attendance.swagger.js';
import { assessmentSwaggerPaths } from './assessment.swagger.js';
import { certificateSwaggerPaths } from './certificate.swagger.js';
import { announcementSwaggerPaths } from './announcement.swagger.js';
import { reportSwaggerPaths } from './report.swagger.js';
import { orgSwaggerPaths } from './org.swagger.js';
import { adminSwaggerPaths } from './admin.swagger.js';

export * from './auth.swagger.js';
export * from './staff.swagger.js';
export * from './centre.swagger.js';
export * from './program.swagger.js';
export * from './cohort.swagger.js';
export * from './application.swagger.js';
export * from './enrollment.swagger.js';
export * from './biometric.swagger.js';
export * from './attendance.swagger.js';
export * from './assessment.swagger.js';
export * from './certificate.swagger.js';
export * from './announcement.swagger.js';
export * from './report.swagger.js';
export * from './org.swagger.js';
export * from './admin.swagger.js';

export const swaggerRoutesPaths: Record<string, any> = {
  '/health': {
    get: {
      summary: 'System Health Check',
      description: 'Returns operational status, active database environment, and server timestamp.',
      responses: {
        200: {
          description: 'System is healthy and operational',
        },
      },
    },
  },
  ...authSwaggerPaths,
  ...staffSwaggerPaths,
  ...centreSwaggerPaths,
  ...programSwaggerPaths,
  ...cohortSwaggerPaths,
  ...applicationSwaggerPaths,
  ...enrollmentSwaggerPaths,
  ...biometricSwaggerPaths,
  ...attendanceSwaggerPaths,
  ...assessmentSwaggerPaths,
  ...certificateSwaggerPaths,
  ...announcementSwaggerPaths,
  ...reportSwaggerPaths,
  ...orgSwaggerPaths,
  ...adminSwaggerPaths,
};
