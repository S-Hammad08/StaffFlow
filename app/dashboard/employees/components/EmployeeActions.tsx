import { Pencil, Trash2 } from "lucide-react";

type EmployeeActionsProps = {
  onDelete: () => void;
  onEdit: () => void;
};

const EmployeeActions = ({ onDelete, onEdit }: EmployeeActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
        type="button"
        aria-label="Edit employee"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        onClick={onDelete}
        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
        type="button"
        aria-label="Delete employee"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default EmployeeActions;
