"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdmin = createSuperAdmin;
const mongoose_1 = __importDefault(require("mongoose"));
const readline_1 = __importDefault(require("readline"));
const db_js_1 = require("../config/db.js");
const user_model_js_1 = require("../models/user.model.js");
const auth_model_js_1 = require("../models/auth.model.js");
const staff_model_js_1 = require("../models/staff.model.js");
const role_model_js_1 = require("../models/role.model.js");
const roles_js_1 = require("../constants/roles.js");
const permissions_js_1 = require("../constants/permissions.js");
// Helper to read inputs from command line
function parseArgs() {
    const args = {};
    for (const arg of process.argv.slice(2)) {
        if (arg.startsWith("--")) {
            const [key, value] = arg.slice(2).split("=");
            if (key && value !== undefined) {
                args[key] = value;
            }
        }
    }
    return args;
}
function promptQuestion(rl, query, defaultValue) {
    return new Promise((resolve) => {
        rl.question(`${query} (${defaultValue}): `, (answer) => {
            resolve(answer.trim() || defaultValue);
        });
    });
}
async function ensureRolesExist() {
    const superAdminRole = roles_js_1.DEFAULT_ROLES.SUPER_ADMIN;
    if (!superAdminRole)
        return;
    const existingRole = await role_model_js_1.Role.findOne({ code: superAdminRole.code });
    if (!existingRole) {
        console.log("[Init] Ensuring SUPER_ADMIN role exists in database...");
        // Ensure permissions are seeded
        const allPerms = Object.values(permissions_js_1.PERMISSIONS);
        for (const perm of allPerms) {
            await role_model_js_1.Permission.findOneAndUpdate({ code: perm }, {
                code: perm,
                module: perm.split(":")[0]?.toUpperCase() || "SYSTEM",
                name: perm.replace(":", " ").toUpperCase(),
                description: `Permission for ${perm}`,
            }, { upsert: true, new: true });
        }
        await role_model_js_1.Role.create({
            code: superAdminRole.code,
            name: superAdminRole.name,
            description: superAdminRole.description,
            defaultScope: superAdminRole.defaultScope,
            permissions: allPerms,
            isSystem: true,
        });
        console.log("[Init] SUPER_ADMIN role created.");
    }
}
async function createSuperAdmin() {
    console.log("==================================================");
    console.log("       AEF Platform - Create Super Admin          ");
    console.log("==================================================");
    await (0, db_js_1.connectDB)();
    await ensureRolesExist();
    const cliArgs = parseArgs();
    let email = cliArgs.email || process.env.SUPERADMIN_EMAIL;
    let password = cliArgs.password || process.env.SUPERADMIN_PASSWORD;
    let firstName = cliArgs.firstName || process.env.SUPERADMIN_FIRSTNAME;
    let lastName = cliArgs.lastName || process.env.SUPERADMIN_LASTNAME;
    let phone = cliArgs.phone || process.env.SUPERADMIN_PHONE;
    // If running interactively and arguments are not fully provided, prompt user
    if (process.stdin.isTTY && (!email || !password)) {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        if (!email)
            email = await promptQuestion(rl, "Super Admin Email", "admin@adelefoundation.org");
        if (!password)
            password = await promptQuestion(rl, "Super Admin Password", "Admin@2026");
        if (!firstName)
            firstName = await promptQuestion(rl, "First Name", "Hon. Adele");
        if (!lastName)
            lastName = await promptQuestion(rl, "Last Name", "Oluwaseun");
        if (!phone)
            phone = await promptQuestion(rl, "Phone Number", "+234 803 000 0001");
        rl.close();
    }
    else {
        // Fallback defaults if non-interactive and unprovided
        email = email || "admin@adelefoundation.org";
        password = password || "Admin@2026";
        firstName = firstName || "Hon. Adele";
        lastName = lastName || "Oluwaseun";
        phone = phone || "+234 803 000 0001";
    }
    const normalizedEmail = email.toLowerCase().trim();
    // 1. Check or Create Staff Record
    let staff = await staff_model_js_1.Staff.findOne({ email: normalizedEmail });
    if (!staff) {
        const staffCount = await staff_model_js_1.Staff.countDocuments();
        const staffCode = `AEF-STF-${String(staffCount + 1).padStart(4, "0")}`;
        staff = await staff_model_js_1.Staff.create({
            staffCode,
            firstName,
            lastName,
            email: normalizedEmail,
            phone,
            gender: "other",
            position: "Executive Director / Super Administrator",
            employmentStatus: "active",
            employmentType: "full-time",
            hasSystemAccount: true,
            dateJoined: new Date(),
        });
        console.log(`[Staff] Created staff record: ${staff.staffCode}`);
    }
    else {
        staff.hasSystemAccount = true;
        await staff.save();
        console.log(`[Staff] Found existing staff record: ${staff.staffCode}`);
    }
    // 2. Check or Create User Record
    let user = await user_model_js_1.User.findOne({ email: normalizedEmail });
    if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.isStaff = true;
        user.isBeneficiary = false;
        user.staffRecordId = staff._id;
        if (!user.roles.includes("SUPER_ADMIN")) {
            user.roles = ["SUPER_ADMIN"];
        }
        user.scopeAssignments = [{ scopeType: "GLOBAL" }];
        await user.save();
        console.log(`[User] Updated existing user with SUPER_ADMIN role: ${user._id}`);
    }
    else {
        user = await user_model_js_1.User.create({
            email: normalizedEmail,
            firstName,
            lastName,
            phone,
            isStaff: true,
            isBeneficiary: false,
            staffRecordId: staff._id,
            roles: ["SUPER_ADMIN"],
            scopeAssignments: [{ scopeType: "GLOBAL" }],
        });
        console.log(`[User] Created new SUPER_ADMIN user: ${user._id}`);
    }
    // 3. Link Staff to User
    staff.userId = user._id;
    await staff.save();
    // 4. Update or Create Auth Credentials
    let auth = await auth_model_js_1.Auth.findOne({ userId: user._id });
    if (auth) {
        auth.password = password; // Will be hashed by pre-save hook
        auth.email = normalizedEmail;
        await auth.save();
        console.log(`[Auth] Password updated for ${normalizedEmail}`);
    }
    else {
        await auth_model_js_1.Auth.create({
            userId: user._id,
            email: normalizedEmail,
            password, // Will be hashed by pre-save hook
        });
        console.log(`[Auth] Created credentials for ${normalizedEmail}`);
    }
    console.log("\n==================================================");
    console.log("   Super Admin Account Successfully Provisioned!  ");
    console.log("==================================================");
    console.log(` Email:    ${normalizedEmail}`);
    console.log(` Role:     SUPER_ADMIN`);
    console.log(` Scope:    GLOBAL`);
    console.log(` Name:     ${firstName} ${lastName}`);
    console.log("==================================================\n");
    await mongoose_1.default.disconnect();
    process.exit(0);
}
// Execute script
createSuperAdmin().catch((err) => {
    console.error("\n[Error] Failed to create Super Admin:", err);
    process.exit(1);
});
// npm run create:admin -- --email=john.admin@example.com --password=MySecurePassword123! --firstName=John --lastName=Doe --phone=+2348000000000
//# sourceMappingURL=createSuperAdmin.js.map