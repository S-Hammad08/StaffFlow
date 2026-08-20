import { ArrowRight, BarChart3, CalendarCheck, UsersRound } from "lucide-react";
import Link from "next/link";

const highlights = [
  {
    title: "Employee records",
    description: "Keep people, status, and department information organized.",
    icon: UsersRound,
  },
  {
    title: "Daily attendance",
    description: "Record and review attendance without duplicate entries.",
    icon: CalendarCheck,
  },
  {
    title: "Useful reporting",
    description: "See the workforce numbers that matter at a glance.",
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-lg font-bold">
              SF
            </span>
            <span className="text-xl">StaffFlow</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            Sign in
          </Link>
        </header>

        <section className="grid flex-1 items-start gap-14 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Run your team from one calm workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              StaffFlow brings employee records, departments, attendance, and
              reporting together in a focused dashboard built for day-to-day HR work.
            </p>
            <Link
              href="/login"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-400"
            >
              Open StaffFlow <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur"
              >
                <Icon className="h-7 w-7 text-blue-300" aria-hidden="true" />
                <h2 className="mt-4 font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
