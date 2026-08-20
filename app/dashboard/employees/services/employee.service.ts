import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Employee, EmployeeFilters, EmployeeInput } from "../types/employee.types";

export type EmployeeQuery = EmployeeFilters & {
  page: number;
  limit: number;
};

export async function getEmployees(filters: EmployeeQuery) {
  const [sortBy, sortOrder] = filters.sort.split("-");
  const response = await api.get<PaginatedResponse<Employee>>("/employees", {
    params: {
      search: filters.search || undefined,
      department: filters.department || undefined,
      status: filters.status || undefined,
      sortBy,
      sortOrder,
      page: filters.page,
      limit: filters.limit,
    },
  });
  return response.data;
}

export async function createEmployee(input: EmployeeInput) {
  const response = await api.post<ApiResponse<Employee>>("/employees", input);
  return response.data.data;
}

export async function updateEmployee({ id, input }: { id: string; input: EmployeeInput }) {
  const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, input);
  return response.data.data;
}

export async function deleteEmployee(id: string) {
  await api.delete(`/employees/${id}`);
}

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: EmployeeQuery) => [...employeeKeys.lists(), filters] as const,
};
