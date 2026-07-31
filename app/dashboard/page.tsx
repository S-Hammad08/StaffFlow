"use client";
import StatCard from "@/components/ui/StatCard";
import ActionButton from "@/components/ui/ActionButton";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  UserCheck,
  CalendarDays,
  FileText,
  UserPlus,
} from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Employees",
    value: 128,
    icon: Users,
    percentage: 12,
    description: "Increase",
    color: "blue",
  },
  {
    id: 2,
    title: "Departments",
    value: 8,
    icon: Building2,
    percentage: 4,
    description: "Decrease",
    color: "green",
  },
  {
    id: 3,
    title: "Present Today",
    value: 112,
    icon: UserCheck,
    percentage: -4,
    description: "Decrease",
    color: "purple",
  },
  {
    id: 4,
    title: "On Leave",
    value: 16,
    icon: CalendarDays,
    percentage: 12,
    description: "Increase",
    color: "blue",
  },
];



const Home = () => {
    const router = useRouter();
const actions = [
  {
    title: "Add Employee",
    icon: UserPlus,
    action: () => router.push("/dashboard/employees"),
  },
  {
    title: "Attendance",
    icon: CalendarDays,
    action: () => router.push("/dashboard/attendance"),
  },
  {
    title: "Departments",
    icon: Building2,
    action: () => router.push("/dashboard/departments"),
  },
  {
    title: "Reports",
    icon: FileText,
    action: () => router.push("/dashboard/reports"),
  },
];
  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-4">Welcome to StaffFlow</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            percentage={stat.percentage}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>

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
      </section>
    </>
  );
};

export default Home;