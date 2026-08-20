import type { RequestHandler } from "express";
import type { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { getValidated } from "../middleware/validate.js";
import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentDateKey, parseDateKey } from "../utils/date.js";
import { toEmployeeDto } from "../utils/dto.js";
import {
  attendanceBodySchema,
  attendanceQuerySchema,
  attendanceUpdateSchema,
  bulkAttendanceSchema,
} from "../validators/attendance.validator.js";

type AttendanceQuery = z.infer<typeof attendanceQuerySchema>;
type AttendanceInput = z.infer<typeof attendanceBodySchema>;
type AttendanceUpdate = z.infer<typeof attendanceUpdateSchema>;
type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
type IdParams = { id: string };
type EmployeeDtoInput = Parameters<typeof toEmployeeDto>[0];

export const listAttendance: RequestHandler = asyncHandler(async (request, response) => {
  const query = getValidated<AttendanceQuery>(request, "query");
  const dateKey = query.date ?? getCurrentDateKey();
  const date = parseDateKey(dateKey);

  const [employees, records] = await Promise.all([
    Employee.find({ status: "Active" })
      .sort({ name: 1 })
      .populate("department", "name")
      .lean(),
    Attendance.find({ date }).lean(),
  ]);
  const recordsByEmployee = new Map(
    records.map((record) => [String(record.employee), record]),
  );

  response.json({
    success: true,
    date: dateKey,
    data: employees.map((employee) => {
      const record = recordsByEmployee.get(String(employee._id));
      return {
        id: record ? String(record._id) : null,
        employee: toEmployeeDto(employee as unknown as EmployeeDtoInput),
        date: dateKey,
        status: record?.status ?? null,
      };
    }),
  });
});

export const saveAttendanceRecord: RequestHandler = asyncHandler(async (request, response) => {
  const input = getValidated<AttendanceInput>(request, "body");
  const employeeExists = await Employee.exists({ _id: input.employeeId, status: "Active" });
  if (!employeeExists) throw new AppError(400, "Attendance can only be recorded for an active employee.");

  const record = await Attendance.findOneAndUpdate(
    { employee: input.employeeId, date: parseDateKey(input.date) },
    { $set: { status: input.status } },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
  response.status(201).json({
    success: true,
    data: {
      id: String(record._id),
      employeeId: String(record.employee),
      date: input.date,
      status: record.status,
    },
  });
});

export const saveBulkAttendance: RequestHandler = asyncHandler(async (request, response) => {
  const input = getValidated<BulkAttendanceInput>(request, "body");
  const employeeIds = input.records.map((record) => record.employeeId);
  const activeEmployeeCount = await Employee.countDocuments({
    _id: { $in: employeeIds },
    status: "Active",
  });
  if (activeEmployeeCount !== employeeIds.length) {
    throw new AppError(400, "One or more employees are missing or inactive.");
  }

  const date = parseDateKey(input.date);
  await Attendance.bulkWrite(
    input.records.map((record) => ({
      updateOne: {
        filter: { employee: record.employeeId, date },
        update: { $set: { status: record.status } },
        upsert: true,
      },
    })),
  );

  response.json({ success: true, data: { saved: input.records.length } });
});

export const updateAttendance: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = getValidated<IdParams>(request, "params");
  const input = getValidated<AttendanceUpdate>(request, "body");
  const record = await Attendance.findByIdAndUpdate(id, input, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!record) throw new AppError(404, "Attendance record not found.");

  response.json({
    success: true,
    data: {
      id: String(record._id),
      employeeId: String(record.employee),
      date: record.date.toISOString().slice(0, 10),
      status: record.status,
    },
  });
});
