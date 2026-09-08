import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { apiRouter } from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { ENV } from "./config/env.js";
import { setupSwagger } from "./config/swagger.js";
import { logger, sendSuccess } from "./utils/index.js";

const app: Application = express();

// Swagger Documentation UI
setupSwagger(app);

// Middlewares
app.use(
  cors({
    origin: [ENV.CORS_ORIGIN, "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

if (!ENV.IS_PROD) {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }),
  );
}


// Health check
app.get("/health", (req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: "ok",
      system: "Adele Empowerment Foundation Management & Training Platform API",
      version: "2.0.0",
      environment: ENV.NODE_ENV,
      database: ENV.DB_NAME,
      timestamp: new Date().toISOString(),
    },
    "API is healthy and operational",
  );
});

// Mount modular API routes
app.use(ENV.API_PREFIX, apiRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
