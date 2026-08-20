import { z } from "zod";

export const employeeBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  department: z.string().trim().min(1, "Department is required.").max(80),
  status: z.enum(["Active", "Inactive"]),
});

export const employeeQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  department: z.string().trim().max(80).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["name", "email", "status", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
