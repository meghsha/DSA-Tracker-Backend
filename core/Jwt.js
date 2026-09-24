import jwt from "jsonwebtoken";

const JWT = {
  sign(payload) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not found");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // token 1 hour ke liye valid
    });
  },

  verify(token) {
    if (!token) throw new Error("Token missing");
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  decode(token) {
    return jwt.decode(token);
  },
};

export default JWT;
