import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Tailwind width class for the dialog panel (default: max-w-lg) */
  dialogClassName?: string;
}
