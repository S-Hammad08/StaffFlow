import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
      <h2 className="text-lg font-semibold mb-6">Menu</h2>

     <nav className="mt-8 space-y-4">
  <Link href="/dashboard" className="block hover:text-slate-300">
    Dashboard
  </Link>

  <Link
    href="/dashboard/employees"
    className="block hover:text-slate-300"
  >
    Employees
  </Link>

  <Link
    href="/dashboard/departments"
    className="block hover:text-slate-300"
  >
    Departments
  </Link>

  <Link
    href="/dashboard/attendance"
    className="block hover:text-slate-300"
  >
    Attendance
  </Link>

  <Link
    href="/dashboard/reports"
    className="block hover:text-slate-300"
  >
    Reports
  </Link>
</nav>
    </aside>
  );
};

export default Sidebar;