import { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { ENV } from '../env.js';
import { swaggerRoutesPaths } from './routes/index.js';

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Adele Empowerment Foundation (AEF) API',
    version: '2.0.0',
    description: `## Adele Empowerment Foundation Digital Operating System
Comprehensive REST API for vocational empowerment programs, candidate application intake, physical document verification, biometric fingerprint registration, live biometric attendance monitoring, practical competency assessments, certified graduation issuance, and executive analytics.

### Authentication
- **Bearer Token**: Pass JWT token in \`Authorization: Bearer <token>\` header for protected endpoints.
- **Biometric Device Gateway**: Pass \`x-api-key\` for biometric edge device ingestion webhooks.`,
    contact: {
      name: 'Adele Empowerment Foundation Technical Directorate',
      email: 'tech@adelefoundation.org',
      url: 'https://adelefoundation.org',
    },
    license: {
      name: 'Proprietary - Adele Empowerment Foundation',
    },
  },
  servers: [
    {
      url: `http://localhost:${ENV.PORT}${ENV.API_PREFIX}`,
      description: 'Local Development Server (API Root)',
    },
    {
      url: `http://localhost:${ENV.PORT}`,
      description: 'Local Base Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token.',
      },
      BiometricGatewayKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Biometric device API secret key.',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 50 },
              total: { type: 'integer', example: 120 },
              totalPages: { type: 'integer', example: 3 },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication, OTP verification, tokens refresh, and session management' },
    { name: 'Organization & Staff', description: 'Corporate profile, departments, staff accounts, volunteers, and partners' },
    { name: 'Training Centres', description: 'Physical training campuses, facilities, inventory assets, and documents' },
    { name: 'Programs & Skills', description: 'Vocational training programs and modular skill areas' },
    { name: 'Cohorts & Schedule', description: 'Training cohorts, sessions timetable, and academic exceptions' },
    { name: 'Applications', description: 'Beneficiary program applications intake and screening workflow' },
    { name: 'Enrollment Queue', description: 'Physical document verification & fingerprint registration pipeline' },
    { name: 'Biometrics', description: 'Optical fingerprint scanners and raw hardware scan ingestion' },
    { name: 'Attendance', description: 'Real-time attendance monitoring, matrix sheets, and manual corrections' },
    { name: 'Assessments', description: 'Skill competency examinations, scorecards, and gradebook results' },
    { name: 'Certificates', description: 'Certificate issuance and cryptographic public QR verification' },
    { name: 'Announcements', description: 'In-app targeted announcements and user notification feed' },
    { name: 'Reports & Analytics', description: 'Executive KPI operations dashboard and demographic impact statistics' },
    { name: 'Administration', description: 'User management, RBAC permission matrix, audit trail, and system settings' },
  ],
  paths: swaggerRoutesPaths,
};

export function setupSwagger(app: Application): void {
  const swaggerOptions = {
    customCss: `
      .swagger-ui .topbar { background-color: #065f46; border-bottom: 2px solid #047857; }
      .swagger-ui .topbar .topbar-wrapper img { content: url('https://adelefoundation.org/logo.png'); height: 38px; }
      .swagger-ui .btn.authorize { background-color: #059669; color: #fff; border-color: #059669; }
      .swagger-ui .opblock.opblock-post { border-color: #059669; background: rgba(5, 150, 105, 0.05); }
      .swagger-ui .opblock.opblock-get { border-color: #0284c7; background: rgba(2, 132, 199, 0.05); }
    `,
    customSiteTitle: 'Adele Empowerment Foundation API Documentation',
  };

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI on multiple convenient paths
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
  app.use(`${ENV.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
}

export * from './routes/index.js';
