"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarCheck,
  CalendarClock,
  UserCheck,
  UserMinus,
  UsersRound,
  UserX,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import { getApiErrorMessage } from "@/lib/api";
import { formatDateKey } from "@/lib/date";
import { getReportSummary, reportKeys } from "./services/report.service";

export default function ReportsPage() {
  const summaryQuery = useQuery({
    queryKey: reportKeys.summary(),
    queryFn: getReportSummary,
  });

  if (summaryQuery.isPending) {
    return (
      <section>
        <PageHeader title="Reports" description="Workforce and attendance insights in one view." />
        <div className="mt-7"><LoadingState message="Calculating reports…" /></div>
      </section>
    );
  }

  if (summaryQuery.isError) {
    return (
      <section>
        <PageHeader title="Reports" description="Workforce and attendance insights in one view." />
        <div className="mt-7">
          <ErrorState
            message={getApiErrorMessage(summaryQuery.error, "Unable to load reports.")}
            onRetry={() => summaryQuery.refetch()}
          />
        </div>
      </section>
    );
  }

  const summary = summaryQuery.data;
  const maxDepartmentCount = Math.max(
    1,
    ...summary.employeesByDepartment.map((item) => item.count),
  );
  const cards = [
    { title: "Total employees", value: summary.totalEmployees, icon: UsersRound, description: "All employee records", color: "blue" as const },
    { title: "Active employees", value: summary.activeEmployees, icon: UserCheck, description: "Currently active", color: "green" as const },
    { title: "Inactive employees", value: summary.inactiveEmployees, icon: UserMinus, description: "Inactive records", color: "purple" as const },
    { title: "Departments", value: summary.totalDepartments, icon: Building2, description: "Organization teams", color: "blue" as const },
    { title: "Present today", value: summary.presentToday, icon: CalendarCheck, description: "Attendance marked present", color: "green" as const },
    { title: "Absent today", value: summary.absentToday, icon: UserX, description: "Attendance marked absent", color: "red" as const },
    { title: "On leave today", value: summary.onLeaveToday, icon: CalendarClock, description: "Attendance marked leave", color: "amber" as const },
  ];

  return (
    <section>
      <PageHeader
        title="Reports"
        description={`Workforce snapshot for ${formatDateKey(summary.date)}.`}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      <article className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Employees by department</h2>
          <p className="mt-1 text-sm text-slate-500">Current distribution across your organization.</p>
        </div>

        {summary.employeesByDepartment.length === 0 ? (
          <p className="mt-8 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            Add employees to see department distribution.
          </p>
        ) : (
          <div className="mt-7 space-y-5">
            {summary.employeesByDepartment.map((item) => (
              <div key={item.department}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700">{item.department}</span>
                  <span className="font-semibold text-slate-900">{item.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.max(5, (item.count / maxDepartmentCount) * 100)}%` }}
                    role="img"
                    aria-label={`${item.department}: ${item.count} employees`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
