export declare const enrollmentSwaggerPaths: {
    '/enrollments/my-training': {
        get: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/enrollments/queue': {
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
    '/enrollments/{id}/verify-physical': {
        post: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                documentsChecked: {
                                    type: string;
                                    example: boolean;
                                };
                                identityVerified: {
                                    type: string;
                                    example: boolean;
                                };
                                physicalNotes: {
                                    type: string;
                                };
                                hasIssue: {
                                    type: string;
                                    example: boolean;
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
    '/enrollments/{id}/register-biometric': {
        post: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                deviceId: {
                                    type: string;
                                };
                                rawSample: {
                                    type: string;
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
    '/enrollments/{id}/drop': {
        post: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                reason: {
                                    type: string;
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
    '/enrollments/{id}/withdraw': {
        post: {
            tags: string[];
            summary: string;
            security: {
                BearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
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
    };
};
