"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_js_1 = require("./routes/index.js");
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
const env_js_1 = require("./config/env.js");
const swagger_js_1 = require("./config/swagger.js");
const index_js_2 = require("./utils/index.js");
const app = (0, express_1.default)();
// Swagger Documentation UI
(0, swagger_js_1.setupSwagger)(app);
// Middlewares
app.use((0, cors_1.default)({
    origin: [env_js_1.ENV.CORS_ORIGIN, "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "20mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "20mb" }));
if (!env_js_1.ENV.IS_PROD) {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined", {
        stream: {
            write: (message) => index_js_2.logger.info(message.trim()),
        },
    }));
}
// Health check
app.get("/health", (req, res) => {
    (0, index_js_2.sendSuccess)(res, {
        status: "ok",
        system: "Adele Empowerment Foundation Management & Training Platform API",
        version: "2.0.0",
        environment: env_js_1.ENV.NODE_ENV,
        database: env_js_1.ENV.DB_NAME,
        timestamp: new Date().toISOString(),
    }, "API is healthy and operational");
});
// Mount modular API routes
app.use(env_js_1.ENV.API_PREFIX, index_js_1.apiRouter);
// Error handlers
app.use(error_middleware_js_1.notFoundHandler);
app.use(error_middleware_js_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map