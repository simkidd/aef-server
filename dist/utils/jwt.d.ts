export interface JwtTokenPayload {
    userId: string;
    email?: string;
    roles?: string[];
}
export declare function signAccessToken(payload: JwtTokenPayload): string;
export declare function verifyAccessToken(token: string): JwtTokenPayload;
export declare function signRefreshToken(payload: JwtTokenPayload): string;
export declare function verifyRefreshToken(token: string): JwtTokenPayload;
