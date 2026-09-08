import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { User } from "./models/user.model.js";
import { seedDatabase } from "./seeds/seed.js";
import { logger } from "./utils/logger.js";

const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Check if admin exists; if completely empty, run initial seed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log(
        "[Bootstrap] Database is empty. Running initial system seed...",
      );
      await seedDatabase();
    }

    // 3. Start HTTP Server
    const server = app.listen(ENV.PORT, () => {
      console.log(`=======================================================`);
      console.log(` Adele Empowerment Foundation Management & Training OS `);
      console.log(` Server active on: http://localhost:${ENV.PORT} `);
      console.log(` Environment:     ${ENV.NODE_ENV} `);
      console.log(` Health Check:    http://localhost:${ENV.PORT}/health `);
      console.log(
        ` API Base:        http://localhost:${ENV.PORT}${ENV.API_PREFIX} `,
      );
      console.log(`=======================================================`);
    });

    const shutdown = () => {
      logger.info("Closing HTTP server...");

      server.close(() => {
        logger.info("HTTP server closed.");
        disconnectDB()
          .catch((err) => {
            logger.error("Error disconnecting from database:", err);
          })
          .finally(() => {
            logger.info("Exiting process.");
            process.exit(0);
          });
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        logger.error("Server did not shut down in time. Exiting forcefully.");
        process.exit(1);
      }, 10000).unref();
    };

    // Graceful shutdown
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection at: ", reason);
      shutdown();
    });
  } catch (error) {
    console.error("[Server Start Error] Fatal error starting server:", error);
    process.exit(1);
  }
};

startServer();
