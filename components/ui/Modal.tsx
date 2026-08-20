"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

type ModalProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: "sm" | "md" | "lg";
  hideHeader?: boolean;
};

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

export default function Modal({
  title,
  description,
  children,
  onClose,
  maxWidth = "md",
  hideHeader = false,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 p-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`my-auto w-full ${widths[maxWidth]} overflow-hidden rounded-2xl bg-white shadow-2xl outline-none`}
      >
        {!hideHeader && (
          <div className="flex items-start justify-between gap-5 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-slate-950">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm text-slate-500">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
        {hideHeader && <h2 id={titleId} className="sr-only">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
