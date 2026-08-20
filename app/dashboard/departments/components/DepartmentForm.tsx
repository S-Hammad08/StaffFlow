"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Department, DepartmentInput } from "../types/department.types";

const departmentSchema = z.object({
  name: z.string().trim().min(1, "Department name is required.").max(80, "Name is too long."),
  description: z.string().trim().max(300, "Description must be 300 characters or fewer."),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

type DepartmentFormProps = {
  mode: "add" | "edit";
  department?: Department;
  isPending?: boolean;
  onSave: (input: DepartmentInput) => void | Promise<void>;
  onCancel: () => void;
};

export default function DepartmentForm({
  mode,
  department,
  isPending = false,
  onSave,
  onCancel,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name ?? "",
      description: department?.description ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5 p-6" noValidate>
      <div>
        <label htmlFor="department-name" className="mb-2 block text-sm font-semibold text-slate-700">
          Department name
        </label>
        <input
          id="department-name"
          type="text"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          placeholder="e.g. Engineering"
        />
        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="department-description" className="mb-2 block text-sm font-semibold text-slate-700">
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="department-description"
          rows={4}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
          className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          placeholder="What does this team own?"
        />
        {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
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
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isPending ? "Saving…" : mode === "edit" ? "Save changes" : "Add department"}
        </button>
      </div>
    </form>
  );
}
