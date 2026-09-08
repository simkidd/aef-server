export declare const assessmentSwaggerPaths: {
    '/assessments': {
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
    '/assessments/results/all': {
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
    '/assessments/results/batch': {
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
                                assessmentId: {
                                    type: string;
                                };
                                results: {
                                    type: string;
                                    items: {
                                        type: string;
                                        required: string[];
                                        properties: {
                                            beneficiaryId: {
                                                type: string;
                                            };
                                            enrollmentId: {
                                                type: string;
                                            };
                                            score: {
                                                type: string;
                                            };
                                            remarks: {
                                                type: string;
                                            };
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
            };
        };
    };
};
