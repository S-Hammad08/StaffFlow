import { z } from "zod";
import { dateKeySchema, objectIdSchema } from "./common.js";

const attendanceStatusSchema = z.enum(["Present", "Absent", "Leave"]);

export const attendanceQuerySchema = z.object({
  date: dateKeySchema.optional(),
});

export const attendanceBodySchema = z.object({
  employeeId: objectIdSchema,
  date: dateKeySchema,
  status: attendanceStatusSchema,
});

export const attendanceUpdateSchema = z.object({
  status: attendanceStatusSchema,
});

export const bulkAttendanceSchema = z
  .object({
    date: dateKeySchema,
    records: z
      .array(
        z.object({
          employeeId: objectIdSchema,
          status: attendanceStatusSchema,
        }),
      )
      .min(1, "At least one attendance record is required.")
      .max(500),
  })
  .superRefine(({ records }, context) => {
    const employeeIds = records.map((record) => record.employeeId);
    if (new Set(employeeIds).size !== employeeIds.length) {
      context.addIssue({
        code: "custom",
        path: ["records"],
        message: "Each employee can appear only once in an attendance save.",
      });
    }
  });
