"use client";
import { useState } from "react";
import type { Employee } from "../types/employee.types";

type EmployeeFormProps = {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
};

const EmployeeForm = ({ employee, onSave, onCancel }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<Employee>(employee);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave(formData);
      }}
      className="mt-6 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Edit Employee</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Name</label>

          <input
            type="text"
            value={formData.name}
            onChange={(event) =>
              setFormData({
                ...formData,
                name: event.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>

          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData({
                ...formData,
                email: event.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Department</label>

          <input
            type="text"
            value={formData.department}
            onChange={(event) =>
              setFormData({
                ...formData,
                department: event.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>

          <select
            value={formData.status}
            onChange={(event) =>
              setFormData({
                ...formData,
                status: event.target.value as Employee["status"],
              })
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
