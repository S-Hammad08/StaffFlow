export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
};

export type EmployeeInput = Pick<
  Employee,
  "name" | "email" | "department" | "status"
>;

export type EmployeeFilters = {
  search: string;
  department: string;
  status: "" | Employee["status"];
  sort: "name-asc" | "name-desc";
};
