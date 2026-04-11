import type { FC } from "react";
import { useEffect } from "react";

import type { ModalProps } from "./types";

export const Modal: FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-600/50 bg-slate-900/95 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-50">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            ✕
          </button>
        </div>
        <div className="text-slate-200">{children}</div>
        {footer ? (
          <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};
