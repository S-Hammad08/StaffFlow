"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Department } from "@/app/dashboard/departments/types/department.types";
import type { Employee, EmployeeInput } from "../types/employee.types";

const employeeSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  department: z.string().min(1, "Department is required."),
  status: z.enum(["Active", "Inactive"]),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

type EmployeeFormProps = {
  mode: "add" | "edit";
  employee?: Employee;
  departments: Department[];
  isPending?: boolean;
  onSave: (employee: EmployeeInput) => void | Promise<void>;
  onCancel: () => void;
};

const emptyEmployee: EmployeeFormValues = {
  name: "",
  email: "",
  department: "",
  status: "Active",
};

const EmployeeForm = ({
  mode,
  employee,
  departments,
  isPending = false,
  onSave,
  onCancel,
}: EmployeeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          name: employee.name,
          email: employee.email,
          department: employee.department,
          status: employee.status,
        }
      : emptyEmployee,
  });

  const fieldClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="p-6"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="employee-name" className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
          <input
            id="employee-name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
            className={fieldClassName}
            placeholder="e.g. Ali Khan"
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="employee-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input
            id="employee-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
            className={fieldClassName}
            placeholder="ali@company.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="employee-department" className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
          <select
            id="employee-department"
            aria-invalid={Boolean(errors.department)}
            {...register("department")}
            className={fieldClassName}
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>{department.name}</option>
            ))}
          </select>
          {errors.department && <p className="mt-1.5 text-sm text-red-600">{errors.department.message}</p>}
        </div>

        <div>
          <label htmlFor="employee-status" className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
          <select
            id="employee-status"
            aria-invalid={Boolean(errors.status)}
            {...register("status")}
            className={fieldClassName}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="mt-1.5 text-sm text-red-600">{errors.status.message}</p>}
        </div>
      </div>

      <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || departments.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isPending
            ? "Saving…"
            : mode === "edit"
              ? "Save changes"
              : "Add employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
