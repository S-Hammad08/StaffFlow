import { Search } from "lucide-react";

type EmployeeSearchProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const EmployeeSearch = ({
  searchTerm,
  onSearchChange,
}: EmployeeSearchProps) => {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="employee-search" className="sr-only">
        Search employees
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        id="employee-search"
        type="search"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search name, email, or department…"
        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
      />
    </div>
  );
};

export default EmployeeSearch;
