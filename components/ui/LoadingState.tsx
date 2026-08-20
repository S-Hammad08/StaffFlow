import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function LoadingState({
  message = "Loading…",
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <div
      className={`grid place-items-center text-center ${
        fullScreen ? "min-h-screen" : "min-h-64 rounded-2xl border border-slate-200 bg-white"
      }`}
      role="status"
    >
      <div>
        <LoaderCircle
          className="mx-auto h-7 w-7 animate-spin text-blue-600"
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}
