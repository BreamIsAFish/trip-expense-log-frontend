import type { FC } from "react";
import { useEffect } from "react";

import type { ModalProps } from "./types";

export const Modal: FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
  dialogClassName = "max-w-lg",
}) => {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/25 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex min-h-full items-end justify-center pb-6 sm:items-center sm:pb-4">
        <div
          className={`my-auto flex min-h-0 w-full ${dialogClassName} max-h-[min(90dvh,calc(100vh-2rem))] flex-col rounded-xl border border-violet-200/90 bg-white shadow-xl shadow-violet-900/10`}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-violet-100/80 p-5 pb-4">
            <h2 id="modal-title" className="text-lg font-semibold text-stone-800">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-stone-400 hover:bg-violet-50 hover:text-stone-700"
            >
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 text-stone-700">
            {children}
          </div>
          {footer ? (
            <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-violet-100/80 p-5 pt-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
