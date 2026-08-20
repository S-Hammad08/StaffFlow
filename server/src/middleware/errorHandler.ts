import mongoose from "mongoose";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

function isDuplicateKeyError(error: unknown): error is { code: number; keyPattern?: Record<string, number> } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new AppError(404, `Route ${request.method} ${request.originalUrl} was not found.`));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  void _next;
  let statusCode = 500;
  let message = "Something went wrong on the server.";
  let errors: Record<string, string[]> | undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (isDuplicateKeyError(error)) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern ?? {})[0] ?? "value";
    message = `A record with that ${field} already exists.`;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "The record could not be validated.";
    errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, validationError]) => [
        field,
        [validationError.message],
      ]),
    );
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "The requested resource id is invalid.";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV === "development" && error instanceof Error
      ? { debug: error.message }
      : {}),
  });
};
