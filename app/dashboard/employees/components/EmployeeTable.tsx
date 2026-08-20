import type { Employee } from "../types/employee.types";
import StatusBadge from "./StatusBadge";
import EmployeeActions from "./EmployeeActions";
type EmployeeTableProp = {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
};

const EmployeeTable = ({ employees, onDelete, onEdit }: EmployeeTableProp) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Name</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Email</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Department</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-slate-100 text-slate-600 last:border-b-0 hover:bg-slate-50/70">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700" aria-hidden="true">
                    {employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="font-semibold text-slate-900">{employee.name}</span>
                </div>
              </td>
              <td className="px-5 py-4">{employee.email}</td>
              <td className="px-5 py-4">{employee.department}</td>

              <td className="px-5 py-4">
                <StatusBadge status={employee.status} />
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end">
                  <EmployeeActions
                    onDelete={() => onDelete(employee)}
                    onEdit={() => onEdit(employee)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EmployeeTable;
