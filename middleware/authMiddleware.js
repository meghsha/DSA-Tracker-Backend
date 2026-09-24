import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../modals/authSchema.js";
import { UnauthorizedError, BadRequestError } from "../core/CustomError.js";
import { Types } from "mongoose";

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.accessToken || req.cookies?.jwt;
    const authHeader = req.headers?.authorization;
    let token = null;

    if (tokenFromCookie) token = tokenFromCookie;
    else if (authHeader && authHeader.startsWith("Bearer "))
      token = authHeader.split(" ")[1];

    if (!token) throw new UnauthorizedError("Authentication token missing");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }

    if (!decoded || !decoded.id || !Types.ObjectId.isValid(decoded.id)) {
      throw new BadRequestError("Invalid token payload");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new UnauthorizedError("User not found");

    req.user = user; // use req.user in controllers
    next();
  } catch (err) {
    next(err);
  }
});

export default authMiddleware;
