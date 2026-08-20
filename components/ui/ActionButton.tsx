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
      type="button"
      onClick={action}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      </span>
      <span className="font-semibold text-slate-800">{title}</span>
    </button>
  );
};

export default ActionButton;
