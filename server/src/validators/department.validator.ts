import { z } from "zod";

export const departmentBodySchema = z.object({
  name: z.string().trim().min(1, "Department name is required.").max(80),
  description: z.string().trim().max(300).default(""),
});
