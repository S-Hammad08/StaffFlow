import { Router } from "express";
import {
  listAttendance,
  saveAttendanceRecord,
  saveBulkAttendance,
  updateAttendance,
} from "../controllers/attendance.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireWriteAccess } from "../middleware/requireWriteAccess.js";
import { validate } from "../middleware/validate.js";
import {
  attendanceBodySchema,
  attendanceQuerySchema,
  attendanceUpdateSchema,
  bulkAttendanceSchema,
} from "../validators/attendance.validator.js";
import { idParamsSchema } from "../validators/common.js";

export const attendanceRouter = Router();

attendanceRouter.use(authenticate);
attendanceRouter.get("/", validate({ query: attendanceQuerySchema }), listAttendance);
attendanceRouter.post(
  "/bulk",
  requireWriteAccess,
  validate({ body: bulkAttendanceSchema }),
  saveBulkAttendance,
);
attendanceRouter.post(
  "/",
  requireWriteAccess,
  validate({ body: attendanceBodySchema }),
  saveAttendanceRecord,
);
attendanceRouter.put(
  "/:id",
  requireWriteAccess,
  validate({ params: idParamsSchema, body: attendanceUpdateSchema }),
  updateAttendance,
);
