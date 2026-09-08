export declare const orgSwaggerPaths: {
    '/org': {
        get: {
            tags: string[];
            summary: string;
            responses: {
                200: {
                    description: string;
                };
            };
        };
        put: {
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
    '/org/departments/all': {
        get: {
            tags: string[];
            summary: string;
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/org/departments': {
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
    '/org/departments/{id}': {
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
            };
        };
    };
};
