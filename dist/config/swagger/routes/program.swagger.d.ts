export declare const programSwaggerPaths: {
    '/programs/skills/all': {
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
    '/programs/skills': {
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
    '/programs/skills/{id}': {
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
    '/programs/published': {
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
    };
    '/programs/published/{id}': {
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
            };
        };
    };
    '/programs/featured': {
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
    '/programs/stats': {
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
    '/programs': {
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
    '/programs/{id}': {
        get: {
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
        delete: {
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
