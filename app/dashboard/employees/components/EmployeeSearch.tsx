type EmployeeSearchProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const EmployeeSearch = ({
  searchTerm,
  onSearchChange,
}: EmployeeSearchProps) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search employees..."
      className="w-full rounded-lg border px-3 py-2"
    />
  );
};

export default EmployeeSearch;
