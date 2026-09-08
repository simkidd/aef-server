"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgController = void 0;
const organization_model_js_1 = require("../models/organization.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class OrgController {
    static getOrgInfo = (0, index_js_1.asyncHandler)(async (req, res) => {
        let org = await organization_model_js_1.Organization.findOne();
        if (!org) {
            org = await organization_model_js_1.Organization.create({
                name: 'Adele Empowerment Foundation',
                code: 'AEF',
                tagline: 'Building Skills, Empowering Lives',
                email: 'info@adelefoundation.org',
                phone: '+234 800 ADELE FDN',
                address: 'Plot 104, Adele Empowerment Crescent, Central Business District',
                state: 'Lagos',
                lga: 'Ikeja',
                country: 'Nigeria',
            });
        }
        (0, index_js_1.sendSuccess)(res, org);
    });
    static updateOrgInfo = (0, index_js_1.asyncHandler)(async (req, res) => {
        const before = await organization_model_js_1.Organization.findOne().lean();
        const updated = await organization_model_js_1.Organization.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'ORGANIZATION_UPDATED',
            entityType: 'Organization',
            entityId: updated._id.toString(),
            beforeState: before || {},
            afterState: updated.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, updated, 'Organization updated successfully');
    });
}
exports.OrgController = OrgController;
//# sourceMappingURL=org.controller.js.map