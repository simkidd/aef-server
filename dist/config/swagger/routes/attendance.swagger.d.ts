export declare const attendanceSwaggerPaths: {
    '/attendance/today-summary': {
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
    };
    '/attendance/sheet': {
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
                    format?: undefined;
                    default?: undefined;
                };
            } | {
                name: string;
                in: string;
                schema: {
                    type: string;
                    format: string;
                    default?: undefined;
                };
            } | {
                name: string;
                in: string;
                schema: {
                    type: string;
                    default: number;
                    format?: undefined;
                };
            })[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/attendance/my-history': {
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
    '/attendance/corrections/{id}': {
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
                                newStatus: {
                                    type: string;
                                    enum: string[];
                                };
                                newClockIn: {
                                    type: string;
                                    format: string;
                                };
                                newClockOut: {
                                    type: string;
                                    format: string;
                                };
                                reason: {
                                    type: string;
                                };
                                supportingEvidenceUrl: {
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
    '/attendance/policies': {
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
    '/attendance/policies/{id}': {
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
