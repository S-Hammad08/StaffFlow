import type { Employee } from "@/app/dashboard/employees/types/employee.types";

export type AttendanceStatus = "Present" | "Absent" | "Leave";

export type AttendanceEntry = {
  id: string | null;
  employee: Employee;
  date: string;
  status: AttendanceStatus | null;
};

export type AttendanceRecordInput = {
  employeeId: string;
  status: AttendanceStatus;
};
