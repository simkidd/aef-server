import { ScopeType } from '../constants/permissions.js';
export interface IScopeAssignment {
    scopeType: ScopeType;
    targetId?: string;
    targetName?: string;
}
export interface IAuth {
    _id: any;
    userId: any;
    email: string;
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastPasswordChangeAt?: Date;
    failedLoginAttempts?: number;
    lockUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOtp {
    _id: any;
    email: string;
    otp: string;
    purpose: 'LOGIN' | 'VERIFICATION' | 'PASSWORD_RESET';
    expiresAt: Date;
    isUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUser {
    _id: any;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    isActive: boolean;
    isStaff: boolean;
    isBeneficiary: boolean;
    staffRecordId?: any;
    beneficiaryProfileId?: any;
    roles: string[];
    customPermissions?: string[];
    scopeAssignments: IScopeAssignment[];
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IRole {
    _id: string;
    name: string;
    code: string;
    description?: string;
    defaultScope: ScopeType;
    permissions: string[];
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IPermission {
    _id: string;
    code: string;
    name: string;
    module: string;
    description?: string;
    createdAt: Date;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        permissions: string[];
        scopeAssignments: IScopeAssignment[];
        isStaff: boolean;
        isBeneficiary: boolean;
        staffRecordId?: string;
        beneficiaryProfileId?: string;
    };
}
