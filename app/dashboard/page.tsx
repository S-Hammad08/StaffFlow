"use client";

import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/ui/StatCard";
import ActionButton from "@/components/ui/ActionButton";
import ErrorState from "@/components/ui/ErrorState";
import PageHeader from "@/components/ui/PageHeader";
import { getApiErrorMessage } from "@/lib/api";
import { getReportSummary, reportKeys } from "./reports/services/report.service";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  UserCheck,
  CalendarDays,
  FileText,
  UserPlus,
} from "lucide-react";

const Home = () => {
  const router = useRouter();
  const summaryQuery = useQuery({
    queryKey: reportKeys.summary(),
    queryFn: getReportSummary,
  });
  const summary = summaryQuery.data;
  const stats = [
    {
      title: "Employees",
      value: summary?.totalEmployees ?? "—",
      icon: Users,
      description: `${summary?.activeEmployees ?? 0} active employees`,
      color: "blue" as const,
    },
    {
      title: "Departments",
      value: summary?.totalDepartments ?? "—",
      icon: Building2,
      description: "Teams across the organization",
      color: "green" as const,
    },
    {
      title: "Present today",
      value: summary?.presentToday ?? "—",
      icon: UserCheck,
      description: "Saved attendance records",
      color: "purple" as const,
    },
    {
      title: "On leave",
      value: summary?.onLeaveToday ?? "—",
      icon: CalendarDays,
      description: "Employees on approved leave",
      color: "amber" as const,
    },
  ];
  const actions = [
    {
      title: "Manage employees",
      icon: UserPlus,
      action: () => router.push("/dashboard/employees"),
    },
    {
      title: "Take attendance",
      icon: CalendarDays,
      action: () => router.push("/dashboard/attendance"),
    },
    {
      title: "Manage departments",
      icon: Building2,
      action: () => router.push("/dashboard/departments"),
    },
    {
      title: "View reports",
      icon: FileText,
      action: () => router.push("/dashboard/reports"),
    },
  ];

  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="A live overview of your team and today's attendance."
      />

      {summaryQuery.isError && (
        <div className="mt-6">
          <ErrorState
            message={getApiErrorMessage(summaryQuery.error, "Unable to load dashboard statistics.")}
            onRetry={() => summaryQuery.refetch()}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!summaryQuery.isError && stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      <div className="mt-9">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {actions.map((act) => (
            <ActionButton
              key={act.title}
              title={act.title}
              icon={act.icon}
              action={act.action}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
