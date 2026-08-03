import { Eye, Pencil, Trash2 } from "lucide-react";

type EmployeeActionsProps = {
  onDelete: () => void;
};

const EmployeeActions = ({ onDelete }: EmployeeActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded p-2 hover:bg-gray-100"
        type="button"
      >
        <Eye className="h-5 w-5" />
      </button>

      <button
        className="rounded p-2 hover:bg-blue-100"
        type="button"
      >
        <Pencil className="h-5 w-5 text-blue-600" />
      </button>

      <button
        onClick={onDelete}
        className="rounded p-2 hover:bg-red-100"
        type="button"
      >
        <Trash2 className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default EmployeeActions;