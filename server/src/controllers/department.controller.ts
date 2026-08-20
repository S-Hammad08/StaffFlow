import type { RequestHandler } from "express";
import type { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { getValidated } from "../middleware/validate.js";
import { Department } from "../models/Department.js";
import { Employee } from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { exactCaseInsensitive } from "../utils/regex.js";
import { departmentBodySchema } from "../validators/department.validator.js";

type DepartmentInput = z.infer<typeof departmentBodySchema>;
type IdParams = { id: string };

type DepartmentAggregate = {
  _id: unknown;
  name: string;
  description: string;
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

function toDepartmentDto(department: DepartmentAggregate) {
  return {
    id: String(department._id),
    name: department.name,
    description: department.description,
    employeeCount: department.employeeCount,
    createdAt: department.createdAt.toISOString(),
    updatedAt: department.updatedAt.toISOString(),
  };
}

export const listDepartments: RequestHandler = asyncHandler(async (_request, response) => {
  const departments = await Department.aggregate<DepartmentAggregate>([
    {
      $lookup: {
        from: "employees",
        localField: "_id",
        foreignField: "department",
        as: "employees",
      },
    },
    { $addFields: { employeeCount: { $size: "$employees" } } },
    { $project: { employees: 0 } },
    { $sort: { name: 1 } },
  ]);
  response.json({ success: true, data: departments.map(toDepartmentDto) });
});

export const createDepartment: RequestHandler = asyncHandler(async (request, response) => {
  const input = getValidated<DepartmentInput>(request, "body");
  const duplicate = await Department.exists({ name: exactCaseInsensitive(input.name) });
  if (duplicate) throw new AppError(409, "A department with that name already exists.");

  const department = await Department.create(input);
  response.status(201).json({
    success: true,
    data: toDepartmentDto({
      ...(department.toObject() as unknown as Omit<DepartmentAggregate, "employeeCount">),
      employeeCount: 0,
    }),
  });
});

export const updateDepartment: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = getValidated<IdParams>(request, "params");
  const input = getValidated<DepartmentInput>(request, "body");
  const duplicate = await Department.exists({
    _id: { $ne: id },
    name: exactCaseInsensitive(input.name),
  });
  if (duplicate) throw new AppError(409, "A department with that name already exists.");

  const department = await Department.findByIdAndUpdate(id, input, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!department) throw new AppError(404, "Department not found.");
  const employeeCount = await Employee.countDocuments({ department: department._id });
  response.json({
    success: true,
    data: toDepartmentDto({
      ...(department.toObject() as unknown as Omit<DepartmentAggregate, "employeeCount">),
      employeeCount,
    }),
  });
});

export const deleteDepartment: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = getValidated<IdParams>(request, "params");
  const department = await Department.findById(id);
  if (!department) throw new AppError(404, "Department not found.");

  const employeeCount = await Employee.countDocuments({ department: department._id });
  if (employeeCount > 0) {
    throw new AppError(
      409,
      `Move or remove ${employeeCount} employee${employeeCount === 1 ? "" : "s"} before deleting this department.`,
    );
  }

  await department.deleteOne();
  response.json({ success: true, message: "Department deleted successfully." });
});
