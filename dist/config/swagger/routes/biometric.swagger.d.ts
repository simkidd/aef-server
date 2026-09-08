export declare const biometricSwaggerPaths: {
    '/biometrics/devices': {
        get: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                schema: {
                    type: string;
                };
            }[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
        post: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            responses: {
                201: {
                    description: string;
                };
            };
        };
    };
    '/biometrics/scan': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                BiometricGatewayKey: never[];
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                deviceSerial: {
                                    type: string;
                                    example: string;
                                };
                                biometricToken: {
                                    type: string;
                                    example: string;
                                };
                                scanType: {
                                    type: string;
                                    enum: string[];
                                    default: string;
                                };
                                timestamp: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
            };
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/biometrics/events': {
        get: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            parameters: ({
                name: string;
                in: string;
                schema: {
                    type: string;
                    default?: undefined;
                };
            } | {
                name: string;
                in: string;
                schema: {
                    type: string;
                    default: number;
                };
            })[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
};
