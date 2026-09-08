export declare const certificateSwaggerPaths: {
    '/certificates': {
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
    '/certificates/issue': {
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
                                enrollmentId: {
                                    type: string;
                                };
                                signatoryName: {
                                    type: string;
                                };
                                signatoryTitle: {
                                    type: string;
                                };
                                grade: {
                                    type: string;
                                };
                                score: {
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
            };
        };
    };
    '/certificates/verify/{code}': {
        get: {
            tags: string[];
            summary: string;
            description: string;
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
};
