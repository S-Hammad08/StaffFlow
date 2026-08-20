import { LucideIcon } from "lucide-react";

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
  color: keyof typeof colorClasses;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color,
}: StatCardProps) => {
  const selectedColor = colorClasses[color];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>

          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`rounded-lg ${selectedColor.bg} p-2`}>
          <Icon className={`h-6 w-6 ${selectedColor.text}`} />
        </div>
      </div>
    </article>
  );
};

export default StatCard;
