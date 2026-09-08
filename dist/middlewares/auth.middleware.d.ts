import { Request, Response, NextFunction } from 'express';
import { ScopeType } from '../constants/permissions.js';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        permissions: string[];
        scopeAssignments: {
            scopeType: ScopeType;
            targetId?: string;
            targetName?: string;
        }[];
        isStaff: boolean;
        isBeneficiary: boolean;
        staffRecordId?: string;
        beneficiaryProfileId?: string;
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
