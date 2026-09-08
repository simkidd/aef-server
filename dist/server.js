"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = require("./config/db.js");
const env_js_1 = require("./config/env.js");
const user_model_js_1 = require("./models/user.model.js");
const seed_js_1 = require("./seeds/seed.js");
const logger_js_1 = require("./utils/logger.js");
const startServer = async () => {
    try {
        // 1. Connect Database
        await (0, db_js_1.connectDB)();
        // 2. Check if admin exists; if completely empty, run initial seed
        const userCount = await user_model_js_1.User.countDocuments();
        if (userCount === 0) {
            console.log("[Bootstrap] Database is empty. Running initial system seed...");
            await (0, seed_js_1.seedDatabase)();
        }
        // 3. Start HTTP Server
        const server = app_js_1.default.listen(env_js_1.ENV.PORT, () => {
            console.log(`=======================================================`);
            console.log(` Adele Empowerment Foundation Management & Training OS `);
            console.log(` Server active on: http://localhost:${env_js_1.ENV.PORT} `);
            console.log(` Environment:     ${env_js_1.ENV.NODE_ENV} `);
            console.log(` Health Check:    http://localhost:${env_js_1.ENV.PORT}/health `);
            console.log(` API Base:        http://localhost:${env_js_1.ENV.PORT}${env_js_1.ENV.API_PREFIX} `);
            console.log(`=======================================================`);
        });
        const shutdown = () => {
            logger_js_1.logger.info("Closing HTTP server...");
            server.close(() => {
                logger_js_1.logger.info("HTTP server closed.");
                (0, db_js_1.disconnectDB)()
                    .catch((err) => {
                    logger_js_1.logger.error("Error disconnecting from database:", err);
                })
                    .finally(() => {
                    logger_js_1.logger.info("Exiting process.");
                    process.exit(0);
                });
            });
            // Force exit after 10 seconds
            setTimeout(() => {
                logger_js_1.logger.error("Server did not shut down in time. Exiting forcefully.");
                process.exit(1);
            }, 10000).unref();
        };
        // Graceful shutdown
        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
        process.on("unhandledRejection", (reason) => {
            logger_js_1.logger.error("Unhandled Rejection at: ", reason);
            shutdown();
        });
    }
    catch (error) {
        console.error("[Server Start Error] Fatal error starting server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map