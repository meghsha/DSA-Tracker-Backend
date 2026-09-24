// config/config.js
import dotenv from "dotenv";
dotenv.config();

export const environment = process.env.NODE_ENV || "development";

export const port = process.env.PORT || 8080;

// MongoDB connection string
export const mongoUri = process.env.MONGO_URI;

// CORS allowed URL
export const corsUrl = process.env.CORS_URL || "*";
