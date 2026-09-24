import mongoose from "mongoose";
import { mongoUri } from "../config.js";
import dns from "node:dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose
  .connect(mongoUri).then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

export default mongoose.connection;
