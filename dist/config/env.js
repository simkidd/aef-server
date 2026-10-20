"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
// Conditional database naming based on environment
const defaultDbName = isProduction
    ? "adele_empowerment_prod_db"
    : "adele_empowerment_dev_db";
const dbName = process.env.DB_NAME || defaultDbName;
// Conditional Mongo URI if not explicitly provided
const defaultMongoUri = isProduction
    ? process.env.PROD_MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`
    : process.env.DEV_MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`;
exports.ENV = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    NODE_ENV: nodeEnv,
    IS_PROD: isProduction,
    API_PREFIX: process.env.API_PREFIX || "/api/v1",
    DB_NAME: dbName,
    MONGO_URI: process.env.MONGO_URI || defaultMongoUri,
    JWT_SECRET: process.env.JWT_SECRET ||
        "adele-empowerment-foundation-secure-secret-key-2026",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ||
        "adele-empowerment-foundation-secure-refresh-key-2026",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    BIOMETRIC_API_KEY: process.env.BIOMETRIC_API_KEY || "aef-biometric-gateway-key-2026",
    BREVO_API_KEY: process.env.BREVO_API_KEY || "",
    BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || "Adele Empowerment Foundation",
    BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || "notifications@adelefoundation.org",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};
//# sourceMappingURL=env.js.map