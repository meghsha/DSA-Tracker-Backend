import { BadRequestError, NotFoundError, UnauthorizedError } from "../core/CustomError.js";
import User from "../modals/authSchema.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Name, email, and password are required");
  }

  if (name.length < 3) {
    throw new BadRequestError("Name must be at least 3 characters long");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Email is not valid");
  }

  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters long");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError("User already exists with this email");
  }

  const user = await User.create({ name, email, password });

  generateToken(res, { id: user._id, email: user.email });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Email is not valid");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("No user found with this email");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequestError("Invalid password");
  }

  const token = generateToken(res, { id: user._id, email: user.email });

  res.status(200).json({
    message: "Login successful",
    accessToken: token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

