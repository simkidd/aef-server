import { Application } from 'express';
export declare const swaggerSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
            url: string;
        };
        license: {
            name: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
            BiometricGatewayKey: {
                type: string;
                in: string;
                name: string;
                description: string;
            };
        };
        schemas: {
            ApiResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    data: {
                        type: string;
                    };
                    pagination: {
                        type: string;
                        properties: {
                            page: {
                                type: string;
                                example: number;
                            };
                            limit: {
                                type: string;
                                example: number;
                            };
                            total: {
                                type: string;
                                example: number;
                            };
                            totalPages: {
                                type: string;
                                example: number;
                            };
                        };
                    };
                };
            };
            ErrorResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                };
            };
        };
    };
    tags: {
        name: string;
        description: string;
    }[];
    paths: Record<string, any>;
};
export declare function setupSwagger(app: Application): void;
export * from './routes/index.js';
