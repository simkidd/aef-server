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
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRoutesPaths = void 0;
const auth_swagger_js_1 = require("./auth.swagger.js");
const staff_swagger_js_1 = require("./staff.swagger.js");
const centre_swagger_js_1 = require("./centre.swagger.js");
const program_swagger_js_1 = require("./program.swagger.js");
const cohort_swagger_js_1 = require("./cohort.swagger.js");
const application_swagger_js_1 = require("./application.swagger.js");
const enrollment_swagger_js_1 = require("./enrollment.swagger.js");
const biometric_swagger_js_1 = require("./biometric.swagger.js");
const attendance_swagger_js_1 = require("./attendance.swagger.js");
const assessment_swagger_js_1 = require("./assessment.swagger.js");
const certificate_swagger_js_1 = require("./certificate.swagger.js");
const announcement_swagger_js_1 = require("./announcement.swagger.js");
const report_swagger_js_1 = require("./report.swagger.js");
const org_swagger_js_1 = require("./org.swagger.js");
const admin_swagger_js_1 = require("./admin.swagger.js");
__exportStar(require("./auth.swagger.js"), exports);
__exportStar(require("./staff.swagger.js"), exports);
__exportStar(require("./centre.swagger.js"), exports);
__exportStar(require("./program.swagger.js"), exports);
__exportStar(require("./cohort.swagger.js"), exports);
__exportStar(require("./application.swagger.js"), exports);
__exportStar(require("./enrollment.swagger.js"), exports);
__exportStar(require("./biometric.swagger.js"), exports);
__exportStar(require("./attendance.swagger.js"), exports);
__exportStar(require("./assessment.swagger.js"), exports);
__exportStar(require("./certificate.swagger.js"), exports);
__exportStar(require("./announcement.swagger.js"), exports);
__exportStar(require("./report.swagger.js"), exports);
__exportStar(require("./org.swagger.js"), exports);
__exportStar(require("./admin.swagger.js"), exports);
exports.swaggerRoutesPaths = {
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
    ...auth_swagger_js_1.authSwaggerPaths,
    ...staff_swagger_js_1.staffSwaggerPaths,
    ...centre_swagger_js_1.centreSwaggerPaths,
    ...program_swagger_js_1.programSwaggerPaths,
    ...cohort_swagger_js_1.cohortSwaggerPaths,
    ...application_swagger_js_1.applicationSwaggerPaths,
    ...enrollment_swagger_js_1.enrollmentSwaggerPaths,
    ...biometric_swagger_js_1.biometricSwaggerPaths,
    ...attendance_swagger_js_1.attendanceSwaggerPaths,
    ...assessment_swagger_js_1.assessmentSwaggerPaths,
    ...certificate_swagger_js_1.certificateSwaggerPaths,
    ...announcement_swagger_js_1.announcementSwaggerPaths,
    ...report_swagger_js_1.reportSwaggerPaths,
    ...org_swagger_js_1.orgSwaggerPaths,
    ...admin_swagger_js_1.adminSwaggerPaths,
};
//# sourceMappingURL=index.js.map