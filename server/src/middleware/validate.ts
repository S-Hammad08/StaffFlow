import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

type ValidationSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (request, _response, next) => {
    try {
      request.validated ??= {};

      for (const location of ["body", "query", "params"] as const) {
        const schema = schemas[location];
        if (!schema) continue;

        const result = schema.safeParse(request[location]);
        if (!result.success) {
          throw new AppError(
            400,
            "Please correct the invalid request fields.",
            result.error.flatten().fieldErrors as Record<string, string[]>,
          );
        }

        request.validated[location] = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function getValidated<T>(
  request: Express.Request,
  location: "body" | "query" | "params",
) {
  return request.validated?.[location] as T;
}
