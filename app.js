import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsUrl } from "./config.js";
import authRoute from "./routes/authRoutes.js"
import mongoSanitize from "express-mongo-sanitize";
import errorHandler from "./middleware/errorMiddleware.js";
import sanitizeHtml from "sanitize-html";

// NEW IMPORTS
import chapterRoute from "./routes/chapterRoutes.js";
import topicRoute from "./routes/topicRoutes.js";
import problemRoute from "./routes/problemRoutes.js";
import progressRoute from "./routes/progressRoutes.js";

const app = express();

// Middlewares
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(mongoSanitize());

app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
            allowedTags: [],
            allowedAttributes: {}
        });
      }
    }
  }
  next();
});


// Routes
app.use("/api/auth", authRoute);

// NEW ROUTES
app.use("/api/chapters", chapterRoute);
app.use("/api/topics", topicRoute);
app.use("/api/problems", problemRoute);
app.use("/api/progress", progressRoute);

// Error handler
app.use(errorHandler);

export default app;