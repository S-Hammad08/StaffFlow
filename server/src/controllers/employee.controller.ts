import type { RequestHandler } from "express";
import { Types } from "mongoose";
import type { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { getValidated } from "../middleware/validate.js";
import { Attendance } from "../models/Attendance.js";
import { Department } from "../models/Department.js";
import { Employee } from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toEmployeeDto } from "../utils/dto.js";
import { escapeRegExp, exactCaseInsensitive } from "../utils/regex.js";
import { employeeBodySchema, employeeQuerySchema } from "../validators/employee.validator.js";

type EmployeeInput = z.infer<typeof employeeBodySchema>;
type EmployeeQuery = z.infer<typeof employeeQuerySchema>;
type IdParams = { id: string };
type EmployeeDtoInput = Parameters<typeof toEmployeeDto>[0];

async function findDepartmentByName(name: string) {
  const department = await Department.findOne({ name: exactCaseInsensitive(name) });
  if (!department) throw new AppError(400, `The department "${name}" does not exist.`);
  return department;
}

export const listEmployees: RequestHandler = asyncHandler(async (request, response) => {
  const query = getValidated<EmployeeQuery>(request, "query");
  const filter: {
    status?: "Active" | "Inactive";
    department?: Types.ObjectId;
    $or?: Array<
      | { name: RegExp }
      | { email: RegExp }
      | { department: { $in: Types.ObjectId[] } }
    >;
  } = {};

  if (query.status) filter.status = query.status;
  if (query.department) {
    const department = await Department.findOne({
      name: exactCaseInsensitive(query.department),
    }).select("_id");

    if (!department) {
      return response.json({
        success: true,
        data: [],
        pagination: { page: query.page, limit: query.limit, total: 0, pages: 0 },
      });
    }
    filter.department = department._id;
  }
  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), "i");
    const matchingDepartments = (await Department.find({ name: search }).distinct(
      "_id",
    )) as Types.ObjectId[];
    filter.$or = [{ name: search }, { email: search }, { department: { $in: matchingDepartments } }];
  }

  const sortDirection = query.sortOrder === "asc" ? 1 : -1;
  const skip = (query.page - 1) * query.limit;
  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .sort({ [query.sortBy]: sortDirection, _id: 1 })
      .skip(skip)
      .limit(query.limit)
      .populate("department", "name")
      .lean(),
    Employee.countDocuments(filter),
  ]);

  response.json({
    success: true,
    data: employees.map((employee) => toEmployeeDto(employee as unknown as EmployeeDtoInput)),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit),
    },
  });
});

export const getEmployee: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = getValidated<IdParams>(request, "params");
  const employee = await Employee.findById(id).populate("department", "name").lean();
  if (!employee) throw new AppError(404, "Employee not found.");
  response.json({
    success: true,
    data: toEmployeeDto(employee as unknown as EmployeeDtoInput),
  });
});

export const createEmployee: RequestHandler = asyncHandler(async (request, response) => {
  const input = getValidated<EmployeeInput>(request, "body");
  const existingEmployee = await Employee.exists({ email: input.email.toLowerCase() });
  if (existingEmployee) throw new AppError(409, "An employee with that email already exists.");

  const department = await findDepartmentByName(input.department);
  const employee = await Employee.create({
    ...input,
    email: input.email.toLowerCase(),
    department: department._id,
  });
  await employee.populate("department", "name");
  response.status(201).json({
    success: true,
    data: toEmployeeDto(employee.toObject() as unknown as EmployeeDtoInput),
  });
});

export const updateEmployee: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = getValidated<IdParams>(request, "params");
  const input = getValidated<EmployeeInput>(request, "body");
  const duplicateEmail = await Employee.exists({
    _id: { $ne: id },
    email: input.email.toLowerCase(),
  });
  if (duplicateEmail) throw new AppError(409, "An employee with that email already exists.");

  const department = await findDepartmentByName(input.department);
  const employee = await Employee.findByIdAndUpdate(
    id,
    { ...input, email: input.email.toLowerCase(), department: department._id },
    { returnDocument: "after", runValidators: true },
  ).populate("department", "name");
  if (!employee) throw new AppError(404, "Employee not found.");

  response.json({
    success: true,
    data: toEmployeeDto(employee.toObject() as unknown as EmployeeDtoInput),
  });
});

export const deleteEmployee: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = getValidated<IdParams>(request, "params");
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw new AppError(404, "Employee not found.");
  await Attendance.deleteMany({ employee: employee._id });
  response.json({ success: true, message: "Employee deleted successfully." });
});
