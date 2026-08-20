export type DepartmentEmployeeCount = {
  department: string;
  count: number;
};

export type ReportSummary = {
  date: string;
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  employeesByDepartment: DepartmentEmployeeCount[];
};
