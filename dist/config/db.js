"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const node_dns_1 = __importDefault(require("node:dns"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
// Ensure Node DNS resolver uses public DNS to prevent querySrv ECONNREFUSED on local routers/ISPs
try {
    node_dns_1.default.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
}
catch {
    // Ignore in environments where setting DNS is restricted
}
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.ENV.MONGO_URI, {
            dbName: env_1.ENV.DB_NAME,
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
        });
        console.log(`[Database] MongoDB Connected [${env_1.ENV.NODE_ENV}]: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    }
    catch (error) {
        console.error(`[Database Error] Connection failed:`, error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    await mongoose_1.default.disconnect();
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=db.js.map