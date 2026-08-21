"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDateKey, getLocalDateKey } from "@/lib/date";
import { getApiErrorMessage } from "@/lib/api";
import AttendanceRegister from "./components/AttendanceRegister";
import {
  attendanceKeys,
  getAttendance,
  saveAttendance,
} from "./services/attendance.service";
import type { AttendanceRecordInput } from "./types/attendance.types";

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const currentUserQuery = useCurrentUser();
  const canWrite = currentUserQuery.data?.role === "admin";
  const [selectedDate, setSelectedDate] = useState(getLocalDateKey);
  const attendanceQuery = useQuery({
    queryKey: attendanceKeys.day(selectedDate),
    queryFn: () => getAttendance(selectedDate),
  });
  const saveMutation = useMutation({
    mutationFn: saveAttendance,
    onSuccess: async (result) => {
      toast.success(`Attendance saved for ${result.saved} employees.`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: attendanceKeys.day(selectedDate) }),
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to save attendance.")),
  });

  const handleSave = (records: AttendanceRecordInput[]) => {
    saveMutation.mutate({ date: selectedDate, records });
  };

  return (
    <section>
      <PageHeader
        title="Attendance"
        description={
          canWrite
            ? "Record daily attendance and review saved entries by date."
            : "Review saved attendance by date in read-only mode."
        }
        action={
          <div>
            <label htmlFor="attendance-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Attendance date
            </label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
            />
          </div>
        }
      />

      <div className="mt-7">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">
          {formatDateKey(selectedDate)}
        </h2>
        {attendanceQuery.isPending ? (
          <LoadingState message="Loading attendance register…" />
        ) : attendanceQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(attendanceQuery.error, "Unable to load attendance.")}
            onRetry={() => attendanceQuery.refetch()}
          />
        ) : attendanceQuery.data.data.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No active employees to mark"
            description="Add an active employee before recording attendance."
          />
        ) : (
          <AttendanceRegister
            key={`${selectedDate}-${attendanceQuery.dataUpdatedAt}`}
            entries={attendanceQuery.data.data}
            readOnly={!canWrite}
            isSaving={saveMutation.isPending}
            onSave={handleSave}
          />
        )}
      </div>
    </section>
  );
}
