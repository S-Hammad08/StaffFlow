"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/app/dashboard/employees/components/StatusBadge";
import type {
  AttendanceEntry,
  AttendanceRecordInput,
  AttendanceStatus,
} from "../types/attendance.types";

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Absent: "border-red-200 bg-red-50 text-red-700",
  Leave: "border-amber-200 bg-amber-50 text-amber-700",
};

type AttendanceRegisterProps = {
  entries: AttendanceEntry[];
  isSaving: boolean;
  onSave: (records: AttendanceRecordInput[]) => void;
};

export default function AttendanceRegister({
  entries,
  isSaving,
  onSave,
}: AttendanceRegisterProps) {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    () =>
      Object.fromEntries(
        entries.map((entry) => [entry.employee.id, entry.status ?? "Present"]),
      ),
  );

  const counts = entries.reduce(
    (totals, entry) => {
      totals[statuses[entry.employee.id]] += 1;
      return totals;
    },
    { Present: 0, Absent: 0, Leave: 0 } as Record<AttendanceStatus, number>,
  );

  const handleSave = () => {
    onSave(
      entries.map((entry) => ({
        employeeId: entry.employee.id,
        status: statuses[entry.employee.id],
      })),
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-4">
        {(Object.keys(counts) as AttendanceStatus[]).map((status) => (
          <span
            key={status}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
          >
            {status}: {counts[status]}
          </span>
        ))}
        <span className="ml-auto text-xs text-slate-500">
          {entries.filter((entry) => entry.status).length} previously saved
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Employee
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Department
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Employee status
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Attendance
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Record
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.employee.id}
                className="border-b border-slate-100 text-slate-600 last:border-0"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {entry.employee.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {entry.employee.email}
                  </p>
                </td>
                <td className="px-5 py-4">{entry.employee.department}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={entry.employee.status} />
                </td>
                <td className="px-5 py-4">
                  <label
                    htmlFor={`attendance-${entry.employee.id}`}
                    className="sr-only"
                  >
                    Attendance for {entry.employee.name}
                  </label>
                  <select
                    id={`attendance-${entry.employee.id}`}
                    value={statuses[entry.employee.id]}
                    onChange={(event) =>
                      setStatuses((current) => ({
                        ...current,
                        [entry.employee.id]: event.target
                          .value as AttendanceStatus,
                      }))
                    }
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:ring-3 focus:ring-blue-100 ${statusStyles[statuses[entry.employee.id]]}`}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  {entry.status ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />{" "}
                      Saved
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">New</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Saving updates existing records for this date instead of creating
          duplicates.
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {isSaving ? "Saving…" : "Save attendance"}
        </button>
      </div>
    </div>
  );
}
