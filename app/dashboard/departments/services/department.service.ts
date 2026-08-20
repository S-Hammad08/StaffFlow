import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Department, DepartmentInput } from "../types/department.types";

export async function getDepartments() {
  const response = await api.get<ApiResponse<Department[]>>("/departments");
  return response.data.data;
}

export async function createDepartment(input: DepartmentInput) {
  const response = await api.post<ApiResponse<Department>>("/departments", input);
  return response.data.data;
}

export async function updateDepartment({
  id,
  input,
}: {
  id: string;
  input: DepartmentInput;
}) {
  const response = await api.put<ApiResponse<Department>>(`/departments/${id}`, input);
  return response.data.data;
}

export async function deleteDepartment(id: string) {
  await api.delete(`/departments/${id}`);
}

export const departmentKeys = {
  all: ["departments"] as const,
  list: () => [...departmentKeys.all, "list"] as const,
};
