import { LucideIcon } from "lucide-react";

type ActionButtonProps = {
  title: string;
  icon: LucideIcon;
  action: () => void;
};

const ActionButton = ({
  title,
  icon: Icon,
  action,
}: ActionButtonProps) => {
  return (
    <button
      onClick={action}
      className="flex w-full items-center gap-3 rounded-lg bg-white px-5 py-4 text-left shadow transition hover:bg-slate-100 hover:shadow-md"
    >
      <Icon className="h-7 w-7 shrink-0" />
      <span className="font-medium">{title}</span>
    </button>
  );
};

export default ActionButton;