import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { AttendanceEntry, AttendanceRecordInput } from "../types/attendance.types";

type AttendanceDayResponse = ApiResponse<AttendanceEntry[]> & {
  date: string;
};

export async function getAttendance(date: string) {
  const response = await api.get<AttendanceDayResponse>("/attendance", {
    params: { date },
  });
  return response.data;
}

export async function saveAttendance({
  date,
  records,
}: {
  date: string;
  records: AttendanceRecordInput[];
}) {
  const response = await api.post<ApiResponse<{ saved: number }>>("/attendance/bulk", {
    date,
    records,
  });
  return response.data.data;
}

export const attendanceKeys = {
  all: ["attendance"] as const,
  day: (date: string) => [...attendanceKeys.all, date] as const,
};
