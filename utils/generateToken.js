// core/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (res, payload, cookieName = "accessToken") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });

  return token;

};

export default generateToken;
