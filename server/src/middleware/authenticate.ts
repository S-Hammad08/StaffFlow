import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";
import { isUserRole, type UserRole } from "../constants/roles.js";
import { AppError } from "../errors/AppError.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

type StaffFlowToken = JwtPayload & {
  userId?: string;
  role?: UserRole;
};

export const authenticate: RequestHandler = asyncHandler(async (request, _response, next) => {
  const token = request.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  if (!token) throw new AppError(401, "Authentication is required.");

  let payload: StaffFlowToken;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as StaffFlowToken;
  } catch {
    throw new AppError(401, "Your session is invalid or has expired.");
  }

  if (!payload.userId || !isUserRole(payload.role)) {
    throw new AppError(401, "Your session is invalid or has expired.");
  }

  const user = await User.findById(payload.userId).select("role").lean();
  if (!user) throw new AppError(401, "Your account is no longer available.");
  if (user.role !== payload.role) {
    throw new AppError(401, "Your session is invalid or has expired.");
  }

  request.user = { id: payload.userId, role: user.role };
  next();
});
