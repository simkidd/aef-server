import { PermissionCode, ScopeType } from './permissions.js';
export interface DefaultRoleConfig {
    name: string;
    code: string;
    description: string;
    defaultScope: ScopeType;
    permissions: PermissionCode[];
    isSystem: boolean;
}
export declare const DEFAULT_ROLES: Record<string, DefaultRoleConfig>;
