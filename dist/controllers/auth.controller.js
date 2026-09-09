"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_model_js_1 = require("../models/user.model.js");
const auth_model_js_1 = require("../models/auth.model.js");
const beneficiaryProfile_model_js_1 = require("../models/beneficiaryProfile.model.js");
const role_model_js_1 = require("../models/role.model.js");
const index_js_1 = require("../utils/index.js");
class AuthController {
    static generateTokenPair(userId) {
        const accessToken = (0, index_js_1.signAccessToken)({ userId });
        const refreshToken = (0, index_js_1.signRefreshToken)({ userId });
        return { accessToken, refreshToken };
    }
    static login = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new index_js_1.AppError("Email and password are required.", 400);
        }
        const user = await user_model_js_1.User.findOne({ email: email.toLowerCase() }).populate({
            path: "staffRecordId",
            select: "assignedCentreId position staffCode",
        });
        if (!user || !user.isActive) {
            throw new index_js_1.AppError("Invalid email or password.", 401);
        }
        const auth = await auth_model_js_1.Auth.findOne({ userId: user._id }).select("+password");
        if (!auth) {
            throw new index_js_1.AppError("Invalid email or password.", 401);
        }
        const isMatch = await auth.comparePassword(password);
        if (!isMatch) {
            throw new index_js_1.AppError("Invalid email or password.", 401);
        }
        user.lastLoginAt = new Date();
        await user.save();
        // Resolve permissions
        const roles = await role_model_js_1.Role.find({ code: { $in: user.roles } }).lean();
        const rolePermissions = roles.flatMap((r) => r.permissions || []);
        const allPermissions = Array.from(new Set([...rolePermissions, ...(user.customPermissions || [])]));
        const { accessToken, refreshToken } = AuthController.generateTokenPair(user._id.toString());
        // Record auth session
        await auth_model_js_1.AuthSession.create({
            userId: user._id,
            token: refreshToken,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        const staffRecord = user.staffRecordId;
        return (0, index_js_1.sendSuccess)(res, {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                permissions: allPermissions,
                scopeAssignments: user.scopeAssignments,
                isStaff: user.isStaff,
                isBeneficiary: user.isBeneficiary,
                staffRecordId: staffRecord?._id || user.staffRecordId,
                assignedCentreId: staffRecord?.assignedCentreId || undefined,
                beneficiaryProfileId: user.beneficiaryProfileId,
            },
        }, "Login successful");
    });
    static registerBeneficiary = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { email, password, firstName, lastName, phone, gender, middleName, } = req.body;
        if (!email || !password || !firstName || !lastName || !phone || !gender) {
            throw new index_js_1.AppError("First name, last name, email, phone, gender, and password are required.", 400);
        }
        const existingUser = await user_model_js_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new index_js_1.AppError("An account with this email already exists.", 409);
        }
        // Generate Beneficiary Code
        const count = await beneficiaryProfile_model_js_1.BeneficiaryProfile.countDocuments();
        const beneficiaryCode = `AEF-BEN-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;
        // 1. Create User
        const user = await user_model_js_1.User.create({
            email: email.toLowerCase(),
            firstName,
            lastName,
            phone,
            isBeneficiary: true,
            isStaff: false,
            roles: ["BENEFICIARY"],
            scopeAssignments: [{ scopeType: "GLOBAL" }],
        });
        // 2. Create Auth Credentials
        await auth_model_js_1.Auth.create({
            userId: user._id,
            email: user.email,
            password,
        });
        // 3. Create Initial Beneficiary Profile
        const profile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.create({
            userId: user._id,
            beneficiaryCode,
            firstName,
            lastName,
            middleName,
            gender,
            phone,
            email: email.toLowerCase(),
            emergencyContact: {
                name: "N/A",
                relationship: "N/A",
                phone: phone,
            },
        });
        user.beneficiaryProfileId = profile._id;
        await user.save();
        const { accessToken, refreshToken } = AuthController.generateTokenPair(user._id.toString());
        await auth_model_js_1.AuthSession.create({
            userId: user._id,
            token: refreshToken,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        // Dispatch asynchronous welcome email via Brevo
        (0, index_js_1.sendWelcomeEmail)(user.email, {
            name: `${firstName} ${lastName}`,
            role: "Beneficiary",
            beneficiaryCode,
        }).catch(() => { });
        return (0, index_js_1.sendSuccess)(res, {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                permissions: [],
                scopeAssignments: user.scopeAssignments,
                isStaff: false,
                isBeneficiary: true,
                beneficiaryProfileId: profile._id,
            },
        }, "Account created successfully", 201);
    });
    static refresh = (0, index_js_1.asyncHandler)(async (req, res) => {
        const refreshToken = req.body.refreshToken || req.headers["x-refresh-token"];
        if (!refreshToken) {
            throw new index_js_1.AppError("Refresh token is required.", 400);
        }
        let decoded;
        try {
            decoded = (0, index_js_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new index_js_1.AppError("Invalid or expired refresh token.", 401);
        }
        const session = await auth_model_js_1.AuthSession.findOne({
            userId: decoded.userId,
            token: refreshToken,
            isRevoked: false,
        });
        if (!session) {
            throw new index_js_1.AppError("Session has been revoked or expired.", 401);
        }
        const user = await user_model_js_1.User.findById(decoded.userId).populate({
            path: "staffRecordId",
            select: "assignedCentreId position staffCode",
        });
        if (!user || !user.isActive) {
            throw new index_js_1.AppError("User account not found or deactivated.", 401);
        }
        // Issue new token pair
        const { accessToken, refreshToken: newRefreshToken } = AuthController.generateTokenPair(user._id.toString());
        // Invalidate old session and record new session
        session.isRevoked = true;
        await session.save();
        await auth_model_js_1.AuthSession.create({
            userId: user._id,
            token: newRefreshToken,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        // Resolve permissions
        const roles = await role_model_js_1.Role.find({ code: { $in: user.roles } }).lean();
        const rolePermissions = roles.flatMap((r) => r.permissions || []);
        const allPermissions = Array.from(new Set([...rolePermissions, ...(user.customPermissions || [])]));
        const staffRecord = user.staffRecordId;
        return (0, index_js_1.sendSuccess)(res, {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                permissions: allPermissions,
                scopeAssignments: user.scopeAssignments,
                isStaff: user.isStaff,
                isBeneficiary: user.isBeneficiary,
                staffRecordId: staffRecord?._id || user.staffRecordId,
                assignedCentreId: staffRecord?.assignedCentreId || undefined,
                beneficiaryProfileId: user.beneficiaryProfileId,
            },
        }, "Token refreshed successfully");
    });
    static logout = (0, index_js_1.asyncHandler)(async (req, res) => {
        const refreshToken = req.body.refreshToken || req.headers["x-refresh-token"];
        const authHeader = req.headers.authorization;
        let userId;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = (0, index_js_1.verifyAccessToken)(token);
                userId = decoded.userId;
            }
            catch {
                // Ignore access token decode errors during logout
            }
        }
        if (refreshToken) {
            await auth_model_js_1.AuthSession.updateMany({ token: refreshToken }, { isRevoked: true });
        }
        if (userId) {
            await auth_model_js_1.AuthSession.updateMany({ userId }, { isRevoked: true });
        }
        return (0, index_js_1.sendSuccess)(res, null, "Logged out successfully");
    });
    static getMe = (0, index_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new index_js_1.AppError("Unauthorized", 401);
        }
        const user = await user_model_js_1.User.findById(req.user.userId)
            .populate("beneficiaryProfileId")
            .populate({
            path: "staffRecordId",
            populate: { path: "assignedCentreId" },
        });
        if (!user) {
            throw new index_js_1.AppError("User not found", 404);
        }
        const staffRecord = user.staffRecordId;
        return (0, index_js_1.sendSuccess)(res, {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            roles: req.user.roles,
            permissions: req.user.permissions,
            scopeAssignments: user.scopeAssignments,
            isStaff: user.isStaff,
            isBeneficiary: user.isBeneficiary,
            staffRecord: user.staffRecordId,
            staffRecordId: staffRecord?._id || user.staffRecordId,
            assignedCentreId: staffRecord?.assignedCentreId || undefined,
            beneficiaryProfile: user.beneficiaryProfileId,
        });
    });
    /**
     * Request / Send OTP code to email via Brevo
     */
    static sendOtp = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { email, purpose = "VERIFICATION" } = req.body;
        if (!email) {
            throw new index_js_1.AppError("Email address is required.", 400);
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await user_model_js_1.User.findOne({ email: normalizedEmail });
        // Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Mark previous active OTPs for this email and purpose as used
        await auth_model_js_1.Otp.updateMany({ email: normalizedEmail, purpose, isUsed: false }, { isUsed: true });
        // Save new OTP (expires in 10 minutes)
        await auth_model_js_1.Otp.create({
            email: normalizedEmail,
            otp,
            purpose,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            isUsed: false,
        });
        // Send email via Brevo
        await (0, index_js_1.sendOtpEmail)(normalizedEmail, {
            otp,
            recipientName: user ? `${user.firstName} ${user.lastName}` : "Valued Member",
            purpose: purpose === "LOGIN"
                ? "Passwordless Login"
                : purpose === "PASSWORD_RESET"
                    ? "Password Reset"
                    : "Account Verification",
            expiresInMinutes: 10,
        });
        return (0, index_js_1.sendSuccess)(res, { email: normalizedEmail, purpose, expiresInMinutes: 10 }, `Verification code dispatched to ${normalizedEmail}`);
    });
    /**
     * Verify OTP code and optionally log in or complete verification
     */
    static verifyOtp = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { email, otp, purpose = "VERIFICATION" } = req.body;
        if (!email || !otp) {
            throw new index_js_1.AppError("Email and OTP code are required.", 400);
        }
        const normalizedEmail = email.toLowerCase().trim();
        const otpRecord = await auth_model_js_1.Otp.findOne({
            email: normalizedEmail,
            otp: otp.trim(),
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });
        if (!otpRecord) {
            throw new index_js_1.AppError("Invalid or expired verification code.", 400);
        }
        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();
        // If purpose is LOGIN, perform full authentication and return token pair
        if (purpose === "LOGIN") {
            const user = await user_model_js_1.User.findOne({ email: normalizedEmail });
            if (!user || !user.isActive) {
                throw new index_js_1.AppError("User account not found or inactive.", 401);
            }
            user.lastLoginAt = new Date();
            await user.save();
            const roles = await role_model_js_1.Role.find({ code: { $in: user.roles } }).lean();
            const rolePermissions = roles.flatMap((r) => r.permissions || []);
            const allPermissions = Array.from(new Set([...rolePermissions, ...(user.customPermissions || [])]));
            const { accessToken, refreshToken } = AuthController.generateTokenPair(user._id.toString());
            await auth_model_js_1.AuthSession.create({
                userId: user._id,
                token: refreshToken,
                ipAddress: req.ip,
                userAgent: req.headers["user-agent"],
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
            return (0, index_js_1.sendSuccess)(res, {
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roles: user.roles,
                    permissions: allPermissions,
                    scopeAssignments: user.scopeAssignments,
                    isStaff: user.isStaff,
                    isBeneficiary: user.isBeneficiary,
                    staffRecordId: user.staffRecordId,
                    beneficiaryProfileId: user.beneficiaryProfileId,
                },
            }, "OTP verified and login successful");
        }
        return (0, index_js_1.sendSuccess)(res, { verified: true, email: normalizedEmail, purpose }, "Verification code successfully validated");
    });
    /**
     * [ADMIN + PORTAL] Update authenticated user profile details
     */
    static updateProfile = (0, index_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new index_js_1.AppError("Unauthorized", 401);
        }
        const { firstName, lastName, phone, alternatePhone, address, gender, dateOfBirth, stateOfOrigin, lgaOfOrigin, stateOfResidence, lgaOfResidence, highestEducation, employmentStatus, identificationType, identificationNumber, emergencyContact, profilePhotoUrl, avatarUrl, } = req.body;
        const user = await user_model_js_1.User.findById(req.user.userId);
        if (!user) {
            throw new index_js_1.AppError("User not found", 404);
        }
        if (firstName !== undefined)
            user.firstName = firstName;
        if (lastName !== undefined)
            user.lastName = lastName;
        if (phone !== undefined)
            user.phone = phone;
        if (avatarUrl !== undefined)
            user.avatarUrl = avatarUrl;
        await user.save();
        let beneficiaryProfile = null;
        if (user.beneficiaryProfileId) {
            beneficiaryProfile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findById(user.beneficiaryProfileId);
            if (beneficiaryProfile) {
                if (firstName !== undefined)
                    beneficiaryProfile.firstName = firstName;
                if (lastName !== undefined)
                    beneficiaryProfile.lastName = lastName;
                if (gender !== undefined)
                    beneficiaryProfile.gender = gender;
                if (dateOfBirth !== undefined)
                    beneficiaryProfile.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
                if (phone !== undefined)
                    beneficiaryProfile.phone = phone;
                if (alternatePhone !== undefined)
                    beneficiaryProfile.alternatePhone = alternatePhone;
                if (address !== undefined)
                    beneficiaryProfile.address = address;
                if (stateOfOrigin !== undefined)
                    beneficiaryProfile.stateOfOrigin = stateOfOrigin;
                if (lgaOfOrigin !== undefined)
                    beneficiaryProfile.lgaOfOrigin = lgaOfOrigin;
                if (stateOfResidence !== undefined)
                    beneficiaryProfile.stateOfResidence = stateOfResidence;
                if (lgaOfResidence !== undefined)
                    beneficiaryProfile.lgaOfResidence = lgaOfResidence;
                if (highestEducation !== undefined)
                    beneficiaryProfile.highestEducation = highestEducation;
                if (employmentStatus !== undefined)
                    beneficiaryProfile.employmentStatus = employmentStatus;
                if (identificationType !== undefined)
                    beneficiaryProfile.identificationType = identificationType;
                if (identificationNumber !== undefined)
                    beneficiaryProfile.identificationNumber = identificationNumber;
                if (emergencyContact !== undefined)
                    beneficiaryProfile.emergencyContact = emergencyContact;
                if (profilePhotoUrl !== undefined)
                    beneficiaryProfile.profilePhotoUrl = profilePhotoUrl;
                await beneficiaryProfile.save();
            }
        }
        return (0, index_js_1.sendSuccess)(res, {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                beneficiaryProfile,
            },
        }, "Profile updated successfully");
    });
    /**
     * [ADMIN + PORTAL] Change password for authenticated user
     */
    static changePassword = (0, index_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new index_js_1.AppError("Unauthorized", 401);
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new index_js_1.AppError("Both current and new passwords are required.", 400);
        }
        if (newPassword.length < 8) {
            throw new index_js_1.AppError("New password must be at least 8 characters long.", 400);
        }
        const auth = await auth_model_js_1.Auth.findOne({ userId: req.user.userId }).select("+password");
        if (!auth) {
            throw new index_js_1.AppError("Authentication record not found.", 404);
        }
        const isMatch = await auth.comparePassword(currentPassword);
        if (!isMatch) {
            throw new index_js_1.AppError("Current password is incorrect.", 400);
        }
        auth.password = newPassword;
        auth.lastPasswordChangeAt = new Date();
        await auth.save();
        return (0, index_js_1.sendSuccess)(res, null, "Password changed successfully");
    });
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map