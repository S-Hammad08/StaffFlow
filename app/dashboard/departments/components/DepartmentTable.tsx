import { Building2, Pencil, Trash2, UsersRound } from "lucide-react";
import type { Department } from "../types/department.types";

type DepartmentTableProps = {
  departments: Department[];
  canWrite: boolean;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
};

export default function DepartmentTable({
  departments,
  canWrite,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Department</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Description</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Employees</th>
            {canWrite && (
              <th scope="col" className="px-5 py-3.5 text-right font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => {
            const hasEmployees = department.employeeCount > 0;
            return (
              <tr key={department.id} className="border-b border-slate-100 text-slate-600 last:border-0 hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-600">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-slate-900">{department.name}</span>
                  </div>
                </td>
                <td className="max-w-md px-5 py-4">
                  {department.description || <span className="text-slate-400">No description</span>}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                    {department.employeeCount}
                  </span>
                </td>
                {canWrite && (
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(department)}
                        aria-label={`Edit ${department.name}`}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(department)}
                        disabled={hasEmployees}
                        title={hasEmployees ? "Move or delete this department's employees first" : `Delete ${department.name}`}
                        aria-label={`Delete ${department.name}`}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
