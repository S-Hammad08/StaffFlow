import bcrypt from "bcryptjs";
import type { CookieOptions, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME } from "../constants/auth.js";
import { AppError } from "../errors/AppError.js";
import { getValidated } from "../middleware/validate.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toUserDto } from "../utils/dto.js";
import type { z } from "zod";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
  path: "/",
};

function issueSession(response: Response, userId: string) {
  const token = jwt.sign({ userId, role: "admin" }, env.JWT_SECRET, {
    expiresIn: "8h",
  });
  response.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
}

export const register: RequestHandler = asyncHandler(async (request, response) => {
  if (!env.ALLOW_REGISTRATION) {
    throw new AppError(403, "Account registration is disabled. Use the seed command to create an administrator.");
  }

  const input = getValidated<RegisterInput>(request, "body");
  const existingUser = await User.exists({ email: input.email.toLowerCase() });
  if (existingUser) throw new AppError(409, "An account with that email already exists.");

  const password = await bcrypt.hash(input.password, 12);
  const user = await User.create({ ...input, email: input.email.toLowerCase(), password });
  issueSession(response, String(user._id));
  response.status(201).json({ success: true, data: toUserDto(user) });
});

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const input = getValidated<LoginInput>(request, "body");
  const user = await User.findOne({ email: input.email.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new AppError(401, "The email or password is incorrect.");
  }

  issueSession(response, String(user._id));
  response.json({ success: true, data: toUserDto(user) });
});

export const logout: RequestHandler = (_request, response) => {
  response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  response.json({ success: true, message: "Logged out successfully." });
};

export const getCurrentUser: RequestHandler = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user?.id);
  if (!user) throw new AppError(404, "User account not found.");
  response.json({ success: true, data: toUserDto(user) });
});
