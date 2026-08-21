import type { UserRole } from "../constants/roles.js";

type EmployeeRecord = {
  _id: unknown;
  name: string;
  email: string;
  department: unknown;
  status: "Active" | "Inactive";
  createdAt?: Date;
  updatedAt?: Date;
};

function getDepartmentName(department: unknown) {
  if (
    typeof department === "object" &&
    department !== null &&
    "name" in department &&
    typeof department.name === "string"
  ) {
    return department.name;
  }

  return "Unassigned";
}

export function toEmployeeDto(employee: EmployeeRecord) {
  return {
    id: String(employee._id),
    name: employee.name,
    email: employee.email,
    department: getDepartmentName(employee.department),
    status: employee.status,
    ...(employee.createdAt ? { createdAt: employee.createdAt.toISOString() } : {}),
    ...(employee.updatedAt ? { updatedAt: employee.updatedAt.toISOString() } : {}),
  };
}

export function toUserDto(user: {
  _id: unknown;
  name: string;
  email: string;
  role: UserRole;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
