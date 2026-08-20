import type { RequestHandler } from "express";
import { Attendance } from "../models/Attendance.js";
import { Department } from "../models/Department.js";
import { Employee } from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentDateKey, parseDateKey } from "../utils/date.js";

type DepartmentCount = {
  department: string;
  count: number;
};

export const getSummary: RequestHandler = asyncHandler(async (_request, response) => {
  const dateKey = getCurrentDateKey();
  const date = parseDateKey(dateKey);
  const [
    totalEmployees,
    activeEmployees,
    totalDepartments,
    presentToday,
    absentToday,
    onLeaveToday,
    employeesByDepartment,
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: "Active" }),
    Department.countDocuments(),
    Attendance.countDocuments({ date, status: "Present" }),
    Attendance.countDocuments({ date, status: "Absent" }),
    Attendance.countDocuments({ date, status: "Leave" }),
    Employee.aggregate<DepartmentCount>([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentRecord",
        },
      },
      { $unwind: "$departmentRecord" },
      { $project: { _id: 0, department: "$departmentRecord.name", count: 1 } },
      { $sort: { count: -1, department: 1 } },
    ]),
  ]);

  response.json({
    success: true,
    data: {
      date: dateKey,
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      totalDepartments,
      presentToday,
      absentToday,
      onLeaveToday,
      employeesByDepartment,
    },
  });
});
