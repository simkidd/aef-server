export declare const staffSwaggerPaths: {
    '/staff': {
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
        post: {
            tags: string[];
            summary: string;
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
                                firstName: {
                                    type: string;
                                };
                                lastName: {
                                    type: string;
                                };
                                email: {
                                    type: string;
                                    format: string;
                                };
                                phone: {
                                    type: string;
                                };
                                position: {
                                    type: string;
                                };
                                departmentId: {
                                    type: string;
                                };
                                assignedCentreId: {
                                    type: string;
                                };
                                category: {
                                    type: string;
                                    enum: string[];
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
            };
        };
    };
    '/staff/{id}': {
        put: {
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
                404: {
                    description: string;
                };
            };
        };
    };
    '/staff/{staffId}/provision-account': {
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
                                password: {
                                    type: string;
                                };
                                roles: {
                                    type: string;
                                    items: {
                                        type: string;
                                    };
                                };
                                scopeAssignments: {
                                    type: string;
                                    items: {
                                        type: string;
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
            };
        };
    };
    '/staff/volunteers/all': {
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
    '/staff/volunteers': {
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
    '/staff/partners/all': {
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
    '/staff/partners': {
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
};
