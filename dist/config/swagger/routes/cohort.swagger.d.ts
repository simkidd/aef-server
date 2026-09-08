export declare const cohortSwaggerPaths: {
    '/cohorts': {
        get: {
            tags: string[];
            summary: string;
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
    '/cohorts/{id}': {
        get: {
            tags: string[];
            summary: string;
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
    '/cohorts/sessions/all': {
        get: {
            tags: string[];
            summary: string;
            parameters: ({
                name: string;
                in: string;
                schema: {
                    type: string;
                    format?: undefined;
                };
            } | {
                name: string;
                in: string;
                schema: {
                    type: string;
                    format: string;
                };
            })[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/cohorts/sessions/{id}/cancel': {
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
    '/cohorts/calendar/all': {
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
    '/cohorts/calendar': {
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
