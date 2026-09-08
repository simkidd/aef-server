"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_js_1 = require("../env.js");
const index_js_1 = require("./routes/index.js");
exports.swaggerSpec = {
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
            url: `http://localhost:${env_js_1.ENV.PORT}${env_js_1.ENV.API_PREFIX}`,
            description: 'Local Development Server (API Root)',
        },
        {
            url: `http://localhost:${env_js_1.ENV.PORT}`,
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
    paths: index_js_1.swaggerRoutesPaths,
};
function setupSwagger(app) {
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
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(exports.swaggerSpec);
    });
    // Serve Swagger UI on multiple convenient paths
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec, swaggerOptions));
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec, swaggerOptions));
    app.use(`${env_js_1.ENV.API_PREFIX}/docs`, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec, swaggerOptions));
}
__exportStar(require("./routes/index.js"), exports);
//# sourceMappingURL=index.js.map