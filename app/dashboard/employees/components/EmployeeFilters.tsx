import { ArrowUpDown, Building2, CircleDot } from "lucide-react";
import type { Department } from "@/app/dashboard/departments/types/department.types";
import type { EmployeeFilters as Filters } from "../types/employee.types";
import EmployeeSearch from "./EmployeeSearch";

type EmployeeFiltersProps = {
  filters: Filters;
  departments: Department[];
  onChange: <Key extends keyof Filters>(key: Key, value: Filters[Key]) => void;
};

const selectClassName =
  "w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100";

export default function EmployeeFilters({
  filters,
  departments,
  onChange,
}: EmployeeFiltersProps) {
  return (
    <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:grid-cols-[minmax(260px,1fr)_220px_180px_180px]">
      <EmployeeSearch
        searchTerm={filters.search}
        onSearchChange={(value) => onChange("search", value)}
      />

      <div className="relative">
        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor="department-filter" className="sr-only">Filter by department</label>
        <select
          id="department-filter"
          value={filters.department}
          onChange={(event) => onChange("department", event.target.value)}
          className={selectClassName}
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <CircleDot className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value as Filters["status"])}
          className={selectClassName}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="relative">
        <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor="employee-sort" className="sr-only">Sort employees</label>
        <select
          id="employee-sort"
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value as Filters["sort"])}
          className={selectClassName}
        >
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
        </select>
      </div>
    </div>
  );
}
