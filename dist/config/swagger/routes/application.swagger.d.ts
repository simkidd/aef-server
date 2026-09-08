export declare const applicationSwaggerPaths: {
    '/applications': {
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
    '/applications/apply': {
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
                                programId: {
                                    type: string;
                                };
                                preferredSkillAreaId: {
                                    type: string;
                                };
                                preferredCentreId: {
                                    type: string;
                                };
                                statementOfPurpose: {
                                    type: string;
                                };
                                previousExperience: {
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
    '/applications/my': {
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
    '/applications/{id}/status': {
        put: {
            tags: string[];
            summary: string;
            description: string;
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
                                status: {
                                    type: string;
                                    enum: string[];
                                };
                                reason: {
                                    type: string;
                                };
                                assignedCohortId: {
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
};
