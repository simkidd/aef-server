export declare const authSwaggerPaths: {
    '/auth/login': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                email: {
                                    type: string;
                                    format: string;
                                    example: string;
                                };
                                password: {
                                    type: string;
                                    example: string;
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
                401: {
                    description: string;
                };
            };
        };
    };
    '/auth/register': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                email: {
                                    type: string;
                                    format: string;
                                };
                                password: {
                                    type: string;
                                };
                                firstName: {
                                    type: string;
                                };
                                lastName: {
                                    type: string;
                                };
                                middleName: {
                                    type: string;
                                };
                                gender: {
                                    type: string;
                                    enum: string[];
                                };
                                dateOfBirth: {
                                    type: string;
                                    format: string;
                                };
                                phone: {
                                    type: string;
                                };
                                alternatePhone: {
                                    type: string;
                                };
                                address: {
                                    type: string;
                                };
                                stateOfOrigin: {
                                    type: string;
                                };
                                lgaOfOrigin: {
                                    type: string;
                                };
                                highestEducation: {
                                    type: string;
                                };
                                employmentStatus: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            responses: {
                201: {
                    description: string;
                };
                409: {
                    description: string;
                };
            };
        };
    };
    '/auth/send-otp': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                email: {
                                    type: string;
                                    format: string;
                                };
                                purpose: {
                                    type: string;
                                    enum: string[];
                                    default: string;
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
    '/auth/verify-otp': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                email: {
                                    type: string;
                                    format: string;
                                };
                                otp: {
                                    type: string;
                                    example: string;
                                };
                                purpose: {
                                    type: string;
                                    enum: string[];
                                    default: string;
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
                400: {
                    description: string;
                };
            };
        };
    };
    '/auth/refresh': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                refreshToken: {
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
                401: {
                    description: string;
                };
            };
        };
    };
    '/auth/logout': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                refreshToken: {
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
    '/auth/me': {
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
                401: {
                    description: string;
                };
            };
        };
    };
    '/auth/profile': {
        put: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                BearerAuth: never[];
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                phone: {
                                    type: string;
                                };
                                alternatePhone: {
                                    type: string;
                                };
                                address: {
                                    type: string;
                                };
                                stateOfResidence: {
                                    type: string;
                                };
                                lgaOfResidence: {
                                    type: string;
                                };
                                emergencyContact: {
                                    type: string;
                                    properties: {
                                        name: {
                                            type: string;
                                        };
                                        relationship: {
                                            type: string;
                                        };
                                        phone: {
                                            type: string;
                                        };
                                    };
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
                401: {
                    description: string;
                };
            };
        };
    };
    '/auth/change-password': {
        put: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                BearerAuth: never[];
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                currentPassword: {
                                    type: string;
                                };
                                newPassword: {
                                    type: string;
                                    minLength: number;
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
                400: {
                    description: string;
                };
                401: {
                    description: string;
                };
            };
        };
    };
};
