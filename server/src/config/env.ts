import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().trim().min(1, "MONGODB_URI is required."),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters."),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  APP_TIMEZONE: z.string().default("UTC"),
  ALLOW_REGISTRATION: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  SEED_ADMIN_NAME: z.string().trim().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(10).optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid server environment configuration:", result.error.flatten().fieldErrors);
  throw new Error("Server environment validation failed.");
}

export const env = result.data;
