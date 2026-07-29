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
};

type StatCardProp = {
  title: string;
  value: number;
  icon: LucideIcon;
  percentage: number;
  description: string;
  color: keyof typeof colorClasses;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  percentage,
  description,
  color,
}: StatCardProp) => {
  const selectedColor = colorClasses[color];

  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold">{value}</h2>

          <p
            className={`mt-2 text-sm ${
              percentage >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {percentage >= 0 ? "+" : ""}
            {percentage}% {description}
          </p>
        </div>

        <div className={`rounded-lg ${selectedColor.bg} p-2`}>
          <Icon className={`h-6 w-6 ${selectedColor.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;