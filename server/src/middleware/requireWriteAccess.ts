import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

export const requireWriteAccess: RequestHandler = (request, _response, next) => {
  if (!request.user) {
    next(new AppError(401, "Authentication is required."));
    return;
  }

  if (request.user.role === "demo") {
    next(new AppError(403, "Demo account is read-only."));
    return;
  }

  next();
};
