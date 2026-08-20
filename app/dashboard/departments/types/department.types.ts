export type Department = {
  id: string;
  name: string;
  description?: string;
  employeeCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DepartmentInput = Pick<Department, "name" | "description">;
